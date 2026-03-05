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
    const loggedInUser = await db.user.findUnique({
      where: {
        clerkUserId: user.id,
      },
      include: {
        transactions: {
          where: {
            type: "CREDIT_PURCHASE",
            createdAt: {
              gte: new Date(
                new Date().getFullYear(),
                new Date().getMonth(),
                new Date().getDate() - 7 // last 7 days
              ),
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
      },
    });

    if (loggedInUser) {
      return loggedInUser;
    }

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
    throw error;
  }
};