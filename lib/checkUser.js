import { currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma";

export const checkUser = async () => {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  const primaryEmail = user.emailAddresses.find(
    (e) => e.id === user.primaryEmailAddressId
  )?.emailAddress;

  if (!primaryEmail) {
    throw new Error("No primary email found for Clerk user");
  }

  const name = [user.firstName, user.lastName]
    .filter(Boolean)
    .join(" ");

  try {
    const dbUser = await db.user.upsert({
      where: { clerkUserId: user.id },
      update: {},
      create: {
        clerkUserId: user.id,
        name,
        imageUrl: user.imageUrl,
        email: primaryEmail,
        transactions: {
          create: {
            type: "CREDIT_PURCHASE",
            packageId: "free-trial",
            amount: 2,
          },
        },
      },
    });

    return dbUser;
  } catch (error) {
    console.error("Database error while checking user:", error);
    throw error; // do not silently fail
  }
};