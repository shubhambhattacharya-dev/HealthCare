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
        // Use direct fetch as the SDK method structure can be inconsistent in beta
        const response = await fetch(`https://api.clerk.com/v1/users/${user.id}/billing/subscription`, {
          headers: {
            'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
            'Content-Type': 'application/json'
          },
          next: { revalidate: 0 } // Ensure we get fresh data
        });

        if (response.ok) {
          const subscription = await response.json();
          const item = subscription?.subscription_items?.[0];
          const plan = item?.plan || subscription?.plan;
          
          if (subscription.status === 'active' && plan) {
            const planSlug = plan.slug;
            const planName = plan.name?.toLowerCase() || '';
            const planId = plan.id || '';

            let mappedPlan = null;
            
            // Priority 1: Check slug
            if (planSlug === 'pro' || planSlug === 'pro_plan') mappedPlan = 'pro';
            else if (planSlug === 'starter' || planSlug === 'starter_plan') mappedPlan = 'starter';
            
            // Priority 2: Check name
            if (!mappedPlan) {
              if (planName.includes('pro')) mappedPlan = 'pro';
              else if (planName.includes('starter')) mappedPlan = 'starter';
            }
            
            // Priority 3: Technical ID Map
            if (!mappedPlan) {
               const PLAN_MAP = {
                 "cplan_3AOmqeky2uwLmoH7ElUqSQYh6y8": "pro",
                 "cplan_3AOmJIZs0w9Bq8OCDMqkomATB61": "starter",
                 "cplan_3AOqkomATB61": "starter",
                 "cplan_3AOUqSQYh6y8": "pro",
               };
               mappedPlan = PLAN_MAP[planId];
            }

            if (mappedPlan && mappedPlan !== existingUser.plan) {
              console.log(`Syncing plan for ${user.id}: ${existingUser.plan} -> ${mappedPlan}`);
              currentPlan = mappedPlan;
            }
          } else if (subscription.status !== 'active' && existingUser.plan !== 'free_user') {
             // Handle expired/canceled subscription
             currentPlan = 'free_user';
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

    // For new users, also check for an existing subscription using direct fetch
    let initialPlan = "free_user";
    try {
      const response = await fetch(`https://api.clerk.com/v1/users/${user.id}/billing/subscription`, {
        headers: {
          'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
          'Content-Type': 'application/json'
        },
        next: { revalidate: 0 }
      });

      if (response.ok) {
        const subscription = await response.json();
        const item = subscription?.subscription_items?.[0];
        const plan = item?.plan || subscription?.plan;
        
        if (subscription.status === 'active' && plan) {
          const planSlug = plan.slug;
          const planName = plan.name?.toLowerCase() || '';
          
          if (planSlug === 'pro' || planSlug === 'pro_plan' || planName.includes('pro')) initialPlan = 'pro';
          else if (planSlug === 'starter' || planSlug === 'starter_plan' || planName.includes('starter')) initialPlan = 'starter';
        }
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
