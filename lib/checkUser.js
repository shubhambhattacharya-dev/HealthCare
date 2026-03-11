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
    
    const existingUser = await db.user.findUnique({
      where: { clerkUserId: user.id },
    });

    
    if (existingUser) {

      const updatedUser = await db.user.update({
        where: { clerkUserId: user.id },
        data: {
          email: primaryEmail,
          name,
          imageUrl: user.imageUrl,
        }
      });

      return updatedUser;
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

    return dbUser;

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
      createdAt: new Date(),
      updatedAt: new Date(),
      specialty: null,
      experience: null,
      description: null,
      credentialUrl: null
    };
  }
};
