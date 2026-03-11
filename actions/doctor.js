"use server"

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/prisma";

export async function setAvailabilitySlots(formData) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const startTime = formData.get("startTime");
  const endTime = formData.get("endTime");

  if (!startTime || !endTime) {
    throw new Error("Start time and end time are required");
  }

  const start = new Date(startTime);
  const end = new Date(endTime);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new Error("Invalid date format");
  }

  if (start >= end) {
    throw new Error("Start time must be before end time");
  }

  try {
    const doctor = await db.user.findUnique({
      where: {
        clerkUserId: userId,
        role: "DOCTOR",
      },
    });

    if (!doctor) {
      throw new Error("Doctor not found");
    }

    const existingSlots = await db.availability.findMany({
      where: { doctorId: doctor.id },
      include: { appointments: true },
    });

    const slotsWithNoAppointments = existingSlots.filter(
      (slot) => !slot.appointments || slot.appointments.length === 0
    );

    if (slotsWithNoAppointments.length > 0) {
      await db.availability.deleteMany({
        where: {
          id: {
            in: slotsWithNoAppointments.map((slot) => slot.id),
          },
        },
      });
    }

    const newSlot = await db.availability.create({
      data: {
        doctorId: doctor.id,
        startTime: start,
        endTime: end,
        status: "AVAILABLE",
      },
    });

    revalidatePath("/doctor");
    return { success: true, slot: newSlot };

  } catch (error) {
    console.error("Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Error setting availability slots";
    throw new Error(errorMessage);
  }
}

export async function getDoctorsAvailability() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const doctor = await db.user.findUnique({
      where: {
        clerkUserId: userId,
        role: "DOCTOR",
      },
    });

    if (!doctor) {
      throw new Error("Doctor not found");
    }

    const availabilitySlots = await db.availability.findMany({
      where: {
        doctorId: doctor.id,
      },
      orderBy: {
        startTime: "asc",  
      },                   
    });

    return { success: true, slots: availabilitySlots }; 

  } catch (error) {
    console.error("Error fetching availability:", error);
    throw new Error("Error fetching availability");
  }
}

export async function getDoctorAppointments() {
  const { userId } = await auth();

  if (!userId) {
    return { appointments: [] };
  }

  try {
    const doctor = await db.user.findUnique({
      where: {
        clerkUserId: userId,
        role: "DOCTOR",
      },
    });

    if (!doctor) {
      return { appointments: [] };
    }

    const appointments = await db.appointment.findMany({
      where: {
        doctorId: doctor.id,
      },
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            email: true,
            imageUrl: true,
          },
        },
      },
      orderBy: {
        startTime: "desc",
      },
    });

    return { appointments };
  } catch (error) {
    console.error("Error fetching doctor appointments:", error);
    return { appointments: [] };
  }
}

export async function getDoctorPayouts() {
  const { userId } = await auth();

  if (!userId) {
    return { payouts: [] };
  }

  try {
    const doctor = await db.user.findUnique({
      where: {
        clerkUserId: userId,
        role: "DOCTOR",
      },
    });

    if (!doctor) {
      return { payouts: [] };
    }

    const payouts = await db.payout.findMany({
      where: {
        doctorId: doctor.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { payouts };
  } catch (error) {
    console.error("Error fetching doctor payouts:", error);
    return { payouts: [] };
  }
}
