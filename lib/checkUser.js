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

    // Calculate credits from transactions
    const credits = existingUser?.creditTransactions?.reduce(
      (sum, t) => sum + t.amount, 0
    ) || 0;

    const dbUser = await db.user.upsert({
      where: { clerkUserId: user.id },
      update: {
        email: primaryEmail,
        name,
        imageUrl: user.imageUrl,
        credits
      },
      create: {
        clerkUserId: user.id,
        name,
        imageUrl: user.imageUrl,
        email: primaryEmail,
        credits: 2,
        creditTransactions: {
          create: {
            type: "ADMIN_ADJUSTMENT",
            amount: 2
          }
        }
      }
    });

    return { ...dbUser, credits: dbUser.credits || credits };

  } catch (error) {
    console.error("Database error while checking user:", error);
    throw error;
  }
};
