"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { VerificationStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function verifyAdmin() {
  const { userId } = await auth();

  if (!userId) {
    return false;
  }

  try {
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    return user?.role === "ADMIN";
  } catch (error) {
    console.error("Error verifying admin:", error);
    return false;
  }
}

export async function getPendingDoctors() {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) {
    return { doctors: [] };
  }

  try {
    const pendingDoctors = await db.user.findMany({
      where: {
        role: "DOCTOR",
        verificationStatus: "PENDING",
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { doctors: pendingDoctors };
  } catch (error) {
    console.error("Error fetching pending doctors:", error);
    return { doctors: [] };
  }
}

export async function getVerifiedDoctors() {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) {
    return { doctors: [] };
  }

  try {
    const verifiedDoctors = await db.user.findMany({
      where: {
        role: "DOCTOR",
        verificationStatus: "VERIFIED",
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return { doctors: verifiedDoctors };
  } catch (error) {
    console.error("Error fetching verified doctors:", error);
    return { doctors: [] };
  }
}

export async function getPendingPayouts() {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) {
    return { payouts: [] };
  }

  try {
    const payouts = await db.payout.findMany({
      where: {
        status: "PROCESSING",
      },
      include: {
        doctor: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Transform to include doctorName and serialize Decimals
    const transformedPayouts = payouts.map(payout => ({
      ...payout,
      doctorName: payout.doctor?.name || "Unknown Doctor",
      email: payout.doctor?.email || payout.payoutEmail,
      amount: Number(payout.amount),
      platformFee: Number(payout.platformFee),
      netAmount: Number(payout.netAmount),
    }));

    return { payouts: transformedPayouts };
  } catch (error) {
    console.error("Error fetching pending payouts:", error);
    return { payouts: [] };
  }
}

// update

export async function updateDoctorStatus(formData) {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) throw new Error("Unauthorized");

  const doctorId = formData.get("doctorId");
  const status = formData.get("status");

  if (!doctorId || !["VERIFIED", "REJECTED"].includes(status)) {
    throw new Error("Invalid data");
  }

  try {
    await db.user.update({
      where: {
        id: doctorId,
      },
      data: {
        verificationStatus: status,
      },
    });

    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Error updating doctor status:", error);
    throw new Error("Internal Server Error");
  }
}

export async function updateDoctorActiveStatus(formData) {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) throw new Error("Unauthorized");

  const doctorId = formData.get("doctorId");
  const suspend = formData.get("suspend") === "true";

  if (!doctorId) {
    throw new Error("Doctor ID is required");
  }

  try {
    // Toggle between VERIFIED and PENDING (PENDING effectively suspends the doctor)
    const status = suspend ? "PENDING" : "VERIFIED";

    await db.user.update({
      where: {
        id: doctorId,
      },
      data: {
        verificationStatus: status,
      },
    });

    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Error updating doctor active status:", error);
    throw new Error("Internal Server Error");
  }
}

export async function updatePayoutStatus(formData) {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) throw new Error("Unauthorized");

  const payoutId = formData.get("payoutId");
  const status = formData.get("status");

  if (!payoutId || !["PROCESSED", "FAILED"].includes(status)) {
    throw new Error("Invalid data");
  }

  try {
    const result = await db.$transaction(async (tx) => {
      // 1. Get payout details
      const payout = await tx.payout.findUnique({
        where: { id: payoutId },
        include: { doctor: true }
      });

      if (!payout) throw new Error("Payout not found");
      if (payout.status !== "PROCESSING") throw new Error("Payout already processed");

      // 2. Update payout status
      const updatedPayout = await tx.payout.update({
        where: { id: payoutId },
        data: {
          status: status,
          processedAt: new Date(),
        },
      });

      // 3. If PROCESSED, deduct credits from doctor and log transaction
      if (status === "PROCESSED") {
        const creditCount = payout.credits;

        // Deduct credits from user
        await tx.user.update({
          where: { id: payout.doctorId },
          data: {
            credits: {
              decrement: creditCount
            }
          }
        });

        // Create a credit transaction record for the payout deduction
        await tx.creditTransaction.create({
          data: {
            userId: payout.doctorId,
            amount: -creditCount, // Negative for deduction
            type: "PAYOUT",
            referenceId: payout.id,
            description: `Payout processed for ${creditCount} credits`,
          }
        });
      }

      return updatedPayout;
    });

    revalidatePath("/admin");
    revalidatePath("/doctor");

    // Serialize Decimal fields for the result
    const serializedResult = {
      ...result,
      amount: Number(result.amount),
      platformFee: Number(result.platformFee),
      netAmount: Number(result.netAmount),
    };

    return { success: true, message: `Payout ${status.toLowerCase()} successfully`, payout: serializedResult };
  } catch (error) {
    console.error("Error updating payout status:", error);
    throw new Error(error.message || "Internal Server Error");
  }
}