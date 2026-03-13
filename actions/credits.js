"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { format } from "date-fns";
import { db } from "@/lib/prisma";

// credits per plan
const PLAN_CREDITS = {
  free_user: 2,
  basic: 5,
  starter: 10,
  pro: 24,
};

export async function checkAndAllocateCredits() {
try {
  const { userId } = await auth();
  const user = await currentUser();


  if (!userId || !user) {
    return { success: false, message: "User not logged in" };
  }

  // Fetch user
  const dbUser = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: {
      creditTransactions: {
        orderBy: { createdAt: "desc" },
        take: 50,
      },
    },
  });

  if (!dbUser) {
    return { success: false, message: "User not found" };
  }

  if (dbUser.role !== "PATIENT") {
    return { success: false, message: "Only patients receive credits" };
  }

  // determine plan - get from user record or default to free_user
  let currentPlan = dbUser.plan || "free_user";
  let creditsForPlan = PLAN_CREDITS[currentPlan] || PLAN_CREDITS.free_user;

  // Get current credits from user record (already calculated from transactions)
  const currentCredits = dbUser.credits;

  // Calculate difference - only top up if user has LESS than plan credits
  const creditsNeeded = creditsForPlan - currentCredits;

  if (creditsNeeded <= 0) {
    return {
      success: true,
      message: "Credits already up to date",
      credits: currentCredits,
    };
  }

  const currentMonth = format(new Date(), "MM-yyyy");

  const existingTransaction = dbUser.creditTransactions?.find((t) => {
    const transactionMonth = format(t.createdAt, "MM-yyyy");
    return (
      transactionMonth === currentMonth &&
      t.type === "ADMIN_ADJUSTMENT"
    );
  });

  if (existingTransaction) {
    return {
      success: true,
      message: "Credits already allocated this month",
      credits: currentCredits,
    };
  }

  // allocate credits
  const updatedUser = await db.$transaction(async (tx) => {

    await tx.creditTransaction.create({
      data: {
        userId: dbUser.id,
        type: "ADMIN_ADJUSTMENT",
        description: `Monthly credits for ${currentPlan} plan`,
        amount: creditsNeeded,
      },
    });

    return await tx.user.update({
      where: { id: dbUser.id },
      data: {
        credits: {
          increment: creditsNeeded,
        },
      },
    });

  });

  revalidatePath("/");
  revalidatePath("/doctors");
  revalidatePath("/appointments");

  return {
    success: true,
    message: "Credits allocated successfully",
    credits: updatedUser.credits,
  };


} catch (error) {
  console.error("Credit allocation error:", error);


  return {
    success: false,
    message: "Error allocating credits",
  };

}
}
