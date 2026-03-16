"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { Vonage } from "@vonage/server-sdk";
import { addDays, addMinutes, format, isBefore, endOfDay, isAfter } from "date-fns";
import { Auth } from "@vonage/auth";

import fs from "fs";
import path from "path";

// Initialize Vonage Video API client
// Use environment variable if available, otherwise read from file (for local development)
let privateKey;
if (process.env.VONAGE_PRIVATE_KEY) {
  privateKey = process.env.VONAGE_PRIVATE_KEY;
} else {
  const privateKeyPath = path.join(process.cwd(), "lib", "private.key");
  privateKey = fs.readFileSync(privateKeyPath, "utf8");
}

const credentials = new Auth({
  applicationId: process.env.NEXT_PUBLIC_VONAGE_APPLICATION_ID,
  privateKey: privateKey,
});
const options = {};
const vonage = new Vonage(credentials, options);

/**
 * Book a new appointment with a doctor
 */
export async function bookAppointment(formData) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    // Get the user from database
    const patient = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
    });

    if (!patient) {
      throw new Error("User record not found. Please try logging out and in again.");
    }

    if (patient.role === "DOCTOR") {
      throw new Error("Doctors cannot book appointments as patients.");
    }

    if (patient.role === "ADMIN") {
      throw new Error("Admins cannot book appointments.");
    }

    // If user is UNASSIGNED, they are now effectively a PATIENT
    if (patient.role === "UNASSIGNED") {
      await db.user.update({
        where: { id: patient.id },
        data: { role: "PATIENT" },
      });
    }

    // Parse form data
    const doctorId = formData.get("doctorId");
    const startTime = new Date(formData.get("startTime"));
    const endTime = new Date(formData.get("endTime"));
    const patientDescription = formData.get("description") || null;

    // Validate input
    if (!doctorId || !startTime || !endTime) {
      throw new Error("Doctor, start time, and end time are required");
    }

    // Validate that appointment time is in the future
    const now = new Date();
    if (isBefore(startTime, now)) {
      throw new Error("Cannot book an appointment in the past");
    }

    // Validate that end time is after start time
    if (!isAfter(endTime, startTime)) {
      throw new Error("End time must be after start time");
    }

    // Check if the doctor exists and is verified
    const doctor = await db.user.findUnique({
      where: {
        id: doctorId,
        role: "DOCTOR",
        verificationStatus: "VERIFIED",
      },
    });

    if (!doctor) {
      throw new Error("Doctor not found or not verified");
    }

    // Check if the patient has enough credits (2 credits per appointment)
    if (patient.credits < 2) {
      throw new Error("Insufficient credits to book an appointment");
    }

    // Check if the requested time slot is available (only future appointments)
    const overlappingAppointment = await db.appointment.findFirst({
      where: {
        doctorId: doctorId,
        status: "SCHEDULED",
        startTime: {
          gte: now, // Only check future appointments
        },
        OR: [
          {
            // New appointment starts during an existing appointment
            startTime: {
              lte: startTime,
            },
            endTime: {
              gt: startTime,
            },
          },
          {
            // New appointment ends during an existing appointment
            startTime: {
              lt: endTime,
            },
            endTime: {
              gte: endTime,
            },
          },
          {
            // New appointment completely overlaps an existing appointment
            startTime: {
              gte: startTime,
            },
            endTime: {
              lte: endTime,
            },
          },
        ],
      },
    });

    if (overlappingAppointment) {
      throw new Error("This time slot is already booked");
    }

    // Create a new Vonage Video API session
    const sessionId = await createVideoSession();

    // Use transaction to ensure credit deduction and appointment creation happen together
    const appointment = await db.$transaction(async (tx) => {
      // 1. Deduct credits from patient
      await tx.user.update({
        where: { id: patient.id },
        data: {
          credits: {
            decrement: 2,
          },
        },
      });

      // 2. Add credits to doctor
      await tx.user.update({
        where: { id: doctor.id },
        data: {
          credits: {
            increment: 2,
          },
        },
      });

      // 3. Create credit transaction for patient (deduction)
      await tx.creditTransaction.create({
        data: {
          userId: patient.id,
          amount: -2,
          type: "APPOINTMENT_DEDUCTION",
          description: `Appointment with Dr. ${doctor.name}`,
        },
      });

      // 4. Create credit transaction for doctor (earning)
      await tx.creditTransaction.create({
        data: {
          userId: doctor.id,
          amount: 2,
          type: "APPOINTMENT_EARNING",
          description: `Appointment with ${patient.name}`,
        },
      });

      // Create the appointment with the video session ID
      const newAppointment = await tx.appointment.create({
        data: {
          patientId: patient.id,
          doctorId: doctor.id,
          startTime,
          endTime,
          patientDescription,
          status: "SCHEDULED",
          videoSessionId: sessionId, // Store the Vonage session ID
        },
      });

      return newAppointment;
    });

    revalidatePath("/appointments");
    return { success: true, appointment: appointment };
  } catch (error) {
    console.error("Failed to book appointment:", error);
    throw new Error("Failed to book appointment: " + error.message);
  }
}

/**
 * Generate a Vonage Video API session
 */
async function createVideoSession() {
  try {
    const session = await vonage.video.createSession({
      mediaMode: "routed"
    });
    return session.sessionId;
  } catch (error) {
    console.error("Vonage session error:", error);
    throw new Error("Failed to create video session: " + error.message);
  }
}

/**
 * Generate a token for a video session
 * This will be called when either doctor or patient is about to join the call
 */
export async function generateVideoToken(formData) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const user = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const appointmentId = formData.get("appointmentId");

    if (!appointmentId) {
      throw new Error("Appointment ID is required");
    }

    // Find the appointment and verify the user is part of it
    const appointment = await db.appointment.findUnique({
      where: {
        id: appointmentId,
      },
    });

    if (!appointment) {
      throw new Error("Appointment not found");
    }

    // Verify the user is either the doctor or the patient for this appointment
    if (appointment.doctorId !== user.id && appointment.patientId !== user.id) {
      throw new Error("You are not authorized to join this call");
    }

    // Verify the appointment is scheduled
    if (appointment.status !== "SCHEDULED") {
      throw new Error("This appointment is not currently scheduled");
    }

    // Verify the appointment is within a valid time range (e.g., starting 5 minutes before scheduled time)
    const now = new Date();
    const appointmentTime = new Date(appointment.startTime);
    const timeDifference = (appointmentTime - now) / (1000 * 60); // difference in minutes

    if (timeDifference > 30) {
      throw new Error(
        "The call will be available 30 minutes before the scheduled time"
      );
    }

    // Generate a token for the video session
    // Token expires 2 hours after the appointment start time
    const appointmentStartTime = new Date(appointment.startTime);
    const expirationTime = Math.floor((appointmentStartTime.getTime() / 1000)) + (2 * 60 * 60); // 2 hours after start time

    // Use user's name and role as connection data
    const connectionData = JSON.stringify({
      name: user.name,
      role: user.role,
      userId: user.id,
    });

    // Generate the token with appropriate role and expiration
    const token = vonage.video.generateClientToken(appointment.videoSessionId, {
      role: "publisher", // Both Doctor and Patient should be publishers to share media
      expireTime: expirationTime,
      data: connectionData,
    });

    // Return token directly - don't store in DB to avoid issues
    return {
      success: true,
      videoSessionId: appointment.videoSessionId,
      token: token,
    };
  } catch (error) {
    console.error("Failed to generate video token:", error);
    throw new Error("Failed to generate video token: " + error.message);
  }
}

/**
 * Get doctor by ID
 */
export async function getDoctorById(doctorId) {
  try {
    const doctor = await db.user.findUnique({
      where: {
        id: doctorId,
        role: "DOCTOR",
        verificationStatus: "VERIFIED",
      },
    });

    if (!doctor) {
      return { doctor: null };
    }

    return { doctor };
  } catch (error) {
    console.error("Failed to fetch doctor:", error);
    return { doctor: null };
  }
}

/**
 * Get available time slots for booking for the next 4 days
 */
export async function getAvailableTimeSlots(doctorId) {
  try {
    // Validate doctor existence and verification
    const doctor = await db.user.findUnique({
      where: {
        id: doctorId,
        role: "DOCTOR",
        verificationStatus: "VERIFIED",
      },
    });

    if (!doctor) {
      throw new Error("Doctor not found or not verified");
    }

    // Fetch a single availability record
    const availability = await db.availability.findFirst({
      where: {
        doctorId: doctor.id,
        status: "AVAILABLE",
      },
    });

    if (!availability) {
      // No availability set by doctor - return empty slots instead of throwing error
      return { slots: [] };
    }

    // Get the next 5 days to ensure we cover all timezones
    const now = new Date();
    // Use an earlier start to ensure we don't miss "today" in any timezone
    const days = [];
    for (let i = 0; i < 5; i++) {
      days.push(addDays(now, i));
    }

    // Fetch existing appointments for the doctor over the next 5 days
    const lastDay = endOfDay(days[days.length - 1]);
    const existingAppointments = await db.appointment.findMany({
      where: {
        doctorId: doctor.id,
        status: "SCHEDULED",
        startTime: {
          gte: addDays(now, -1), // Get some overlap
          lte: lastDay,
        },
      },
    });

    const availableSlotsByDay = {};

    // For each day, generate available slots
    for (const day of days) {
      const dayString = format(day, "yyyy-MM-dd");
      availableSlotsByDay[dayString] = [];

      const availabilityStart = new Date(availability.startTime);
      const availabilityEnd = new Date(availability.endTime);

      // Apply the time from availability to the target day
      availabilityStart.setFullYear(day.getFullYear(), day.getMonth(), day.getDate());
      availabilityEnd.setFullYear(day.getFullYear(), day.getMonth(), day.getDate());

      let current = new Date(availabilityStart);
      const end = new Date(availabilityEnd);

      while (
        isBefore(addMinutes(current, 30), end) ||
        +addMinutes(current, 30) === +end
      ) {
        const next = addMinutes(current, 30);

        // Skip slots that are more than 15 minutes in the past
        // This gives a grace period for "right now" bookings
        const gracePeriod = addMinutes(now, -15);
        if (isBefore(current, gracePeriod)) {
          current = next;
          continue;
        }

        const overlaps = existingAppointments.some((appointment) => {
          const aStart = new Date(appointment.startTime);
          const aEnd = new Date(appointment.endTime);

          return (
            (current >= aStart && current < aEnd) ||
            (next > aStart && next <= aEnd) ||
            (current <= aStart && next >= aEnd)
          );
        });

        if (!overlaps) {
          availableSlotsByDay[dayString].push({
            startTime: current.toISOString(),
            endTime: next.toISOString(),
            formatted: `${format(current, "h:mm a")} - ${format(
              next,
              "h:mm a"
            )}`,
            day: format(current, "EEEE, MMMM d"),
          });
        }

        current = next;
      }
    }

    // Convert to array of slots grouped by day
    const result = Object.entries(availableSlotsByDay)
      .filter(([_, slots]) => true) // Keep all days for now to see the tabs
      .map(([date, slots]) => ({
        date,
        displayDate:
          slots.length > 0
            ? slots[0].day
            : format(new Date(date), "EEEE, MMMM d"),
        slots,
      }));

    return { days: result };
  } catch (error) {
    console.error("Failed to fetch available slots:", error);
    throw new Error("Failed to fetch available time slots: " + error.message);
  }
}

/**
 * Get doctor's raw availability (start and end times)
 */
export async function getDoctorAvailabilityForPatient(doctorId) {
  try {
    const availability = await db.availability.findFirst({
      where: {
        doctorId: doctorId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return { availability };
  } catch (error) {
    console.error("Error getting doctor availability:", error);
    return { availability: null };
  }
}

/**
 * Get current user's (patient) appointments
 */
export async function getUserAppointments() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const user = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const appointments = await db.appointment.findMany({
      where: {
        patientId: user.id,
      },
      include: {
        doctor: true,
      },
      orderBy: {
        startTime: "desc",
      },
    });

    return { appointments };
  } catch (error) {
    throw new Error("Failed to fetch user appointments: " + error.message);
  }
}