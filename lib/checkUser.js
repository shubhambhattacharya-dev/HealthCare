import { currentUser, createClerkClient } from "@clerk/nextjs/server";
import { db } from "./prisma";

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
        const subscription = await clerkClient.users.getUserBillingSubscription(user.id);
        if (subscription && subscription.plan) {
           // Map Clerk plan to our internal plan names
           const planId = subscription.plan.id;
           const PLAN_MAP = {
             "starter_plan": "starter",
             "pro": "pro",
             "free_user": "free_user",
             // Add technical IDs if known
             "cplan_3AOqkomATB61": "starter",
             "cplan_3AOUqSQYh6y8": "pro",
           };
           
           let mappedPlan = PLAN_MAP[planId] || (planId.includes('pro') ? 'pro' : planId.includes('starter') ? 'starter' : 'free_user');
           
           if (mappedPlan !== existingUser.plan) {
             console.log(`Syncing plan for ${user.id}: ${existingUser.plan} -> ${mappedPlan}`);
             currentPlan = mappedPlan;
           }
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
