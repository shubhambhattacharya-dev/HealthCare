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
        
        // Clerk Billing Beta response structure check
        const item = subscription?.subscription_items?.[0];
        const plan = item?.plan || subscription?.plan;
        const planId = plan?.id || item?.plan_id;

        if (planId) {
           // Map Clerk plan to our internal plan names
           const PLAN_MAP = {
             "starter_plan": "starter",
             "pro": "pro",
             "free_user": "free_user",
             // Confirmed technical IDs from instance logs
             "cplan_3AOqkomATB61": "starter",
             "cplan_3AOmqeky2uwLmoH7ElUqSQYh6y8": "pro", // Updated Pro ID
             "cplan_3AOUqSQYh6y8": "pro", 
           };
           
           let mappedPlan = PLAN_MAP[planId];
           
           // Fallback logic if the ID is new
           if (!mappedPlan) {
              const lowerPlanName = plan?.name?.toLowerCase() || '';
              const lowerPlanId = planId.toLowerCase();
              if (lowerPlanName.includes('pro') || lowerPlanId.includes('pro')) mappedPlan = 'pro';
              else if (lowerPlanName.includes('starter') || lowerPlanId.includes('starter')) mappedPlan = 'starter';
              else mappedPlan = 'free_user';
           }
           
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

    // For new users, also check for an existing subscription
    let initialPlan = "free_user";
    try {
      const subscription = await clerkClient.users.getUserBillingSubscription(user.id);
      const item = subscription?.subscription_items?.[0];
      const plan = item?.plan || subscription?.plan;
      const planId = plan?.id || item?.plan_id;

      if (planId) {
        const PLAN_MAP = {
          "starter_plan": "starter",
          "pro": "pro",
          "free_user": "free_user",
          "cplan_3AOqkomATB61": "starter",
          "cplan_3AOmqeky2uwLmoH7ElUqSQYh6y8": "pro",
        };
        initialPlan = PLAN_MAP[planId] || (planId.includes('pro') ? 'pro' : planId.includes('starter') ? 'starter' : 'free_user');
      }
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
