import { currentUser, createClerkClient } from "@clerk/nextjs/server";
import { db } from "./prisma";
import { syncUserPlan } from "./billingSync";

const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

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
      // Sync plan from Clerk Billing if it's a patient or admin
      let currentPlan = existingUser.plan;
      
      try {
        const syncedUser = await syncUserPlan(existingUser.id, user.id);
        if (syncedUser) {
          currentPlan = syncedUser.plan;
        }
      } catch (billingError) {
        console.warn("Clerk Billing sync failed:", billingError.message);
      }

      const updatedUser = await db.user.update({
        where: { clerkUserId: user.id },
        data: {
          email: primaryEmail,
          name,
          imageUrl: user.imageUrl,
          plan: currentPlan,
        }
      });

      return updatedUser;
    }

    // For new users, also check for an existing subscription using syncUserPlan
    let initialPlan = "free_user";
    try {
       // We can iterate synchronously for a new user just in case
       const synced = await syncUserPlan(null, user.id); 
       if (synced) initialPlan = synced.plan;
    } catch (e) {
      console.warn("New user plan sync failed:", e.message);
    }

    // Create new user with initial credits based on plan
    const dbUser = await db.user.create({
      data: {
        clerkUserId: user.id,
        name,
        imageUrl: user.imageUrl,
        email: primaryEmail,
        plan: initialPlan,
        credits: 2, // Start with welcome credits
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
