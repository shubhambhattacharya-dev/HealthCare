import { currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma";

export const checkUser = async () => {
  const user = await currentUser();

  if (!user) return null;

  const primaryEmail = user.emailAddresses.find(
    (e) => e.id === user.primaryEmailAddressId
  )?.emailAddress;

  if (!primaryEmail) {
    throw new Error("No primary email found for Clerk user");
  }

  const name =
    [user.firstName, user.lastName].filter(Boolean).join(" ") || "User";

  try {
    // First check if user already exists
    const existingUser = await db.user.findUnique({
      where: { clerkUserId: user.id },
      include: { creditTransactions: true }
    });

    // If user exists, return them with calculated credits from transactions
    if (existingUser) {
      // Calculate credits from transactions
      const credits = existingUser.creditTransactions?.reduce(
        (sum, t) => {
          // Add positive amounts (CREDIT_PURCHASE, REFUND, ADMIN_ADJUSTMENT)
          if (t.type === "CREDIT_PURCHASE" || t.type === "REFUND" || t.type === "ADMIN_ADJUSTMENT") {
            return sum + t.amount;
          }
          // Subtract for deductions (APPOINTMENT_DEDUCTION)
          if (t.type === "APPOINTMENT_DEDUCTION") {
            return sum - t.amount;
          }
          return sum;
        }, 0
      ) || 0;

      // Update user with latest credit balance
      const updatedUser = await db.user.update({
        where: { clerkUserId: user.id },
        data: {
          email: primaryEmail,
          name,
          imageUrl: user.imageUrl,
          credits
        }
      });

      return { ...updatedUser, credits };
    }

    // Create new user with initial credits
    const dbUser = await db.user.create({
      data: {
        clerkUserId: user.id,
        name,
        imageUrl: user.imageUrl,
        email: primaryEmail,
        credits: 2,
        creditTransactions: {
          create: {
            type: "ADMIN_ADJUSTMENT",
            amount: 2,
            description: "Welcome credits"
          }
        }
      }
    });

    return { ...dbUser, credits: 2 };

  } catch (error) {
    console.error("Database error while checking user:", error);
    // Return a basic user object if database is unavailable
    return {
      id: user.id,
      clerkUserId: user.id,
      name,
      email: primaryEmail,
      imageUrl: user.imageUrl,
      role: "UNASSIGNED",
      credits: 2,
      verificationStatus: "PENDING",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      specialty: null,
      experience: null,
      description: null,
      credentialUrl: null
    };
  }
};
