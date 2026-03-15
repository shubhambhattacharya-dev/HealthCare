"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

/**
 * Get doctor's payouts history
 */
export async function getDoctorPayouts() {
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
        throw new Error("Failed to fetch payouts: " + error.message);
    }
}

/**
 * Get doctor's earnings summary
 */
export async function getDoctorEarnings() {
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

        // Get completed appointments for earnings calculation
        const completedAppointments = await db.appointment.findMany({
            where: {
                doctorId: doctor.id,
                status: "COMPLETED",
            },
        });

        // Each completed appointment is worth 2 credits
        return {
            earnings: {
                totalCredits: completedAppointments.length * 2,
                appointmentsCount: completedAppointments.length,
                appointments: completedAppointments.map(apt => ({
                    id: apt.id,
                    amount: 2,
                    date: apt.startTime,
                    status: apt.status
                }))
            }
        };
    } catch (error) {
        throw new Error("Failed to fetch earnings: " + error.message);
    }
}
