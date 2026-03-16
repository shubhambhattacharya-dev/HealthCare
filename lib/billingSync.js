import { db } from "./prisma";

export async function syncUserPlan(userId, clerkUserId) {
  try {
    const response = await fetch(`https://api.clerk.com/v1/users/${clerkUserId}/billing/subscription`, {
      headers: {
        'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
        'Content-Type': 'application/json'
      },
      next: { revalidate: 0 }
    });

    if (!response.ok) {
      console.warn(`Clerk Billing API returned ${response.status} for user ${clerkUserId}`);
      return null;
    }

    const subscription = await response.json();
    const item = subscription?.subscription_items?.[0];
    const plan = item?.plan || subscription?.plan;
    
    if (subscription.status === 'active' && plan) {
      const planSlug = plan.slug;
      const planName = plan.name?.toLowerCase() || '';
      const planId = plan.id || '';

      const PLAN_MAP = {
        "cplan_3AOmqeky2uwLmoH7ElUqSQYh6y8": "pro",
        "cplan_3AOmJIZs0w9Bq8OCDMqkomATB61": "starter",
        "cplan_3AOqkomATB61": "starter",
        "cplan_3AOUqSQYh6y8": "pro",
      };

      let mappedPlan = PLAN_MAP[planId];
      
      if (!mappedPlan) {
        if (planSlug === 'pro' || planSlug === 'pro_plan' || planName.includes('pro')) mappedPlan = 'pro';
        else if (planSlug === 'starter' || planSlug === 'starter_plan' || planName.includes('starter')) mappedPlan = 'starter';
        else mappedPlan = 'free_user';
      }

      console.log(`SyncUtility: Detected plan ${mappedPlan} for user ${clerkUserId}`);
      
      // Update DB only if user exists
      try {
        const existing = await db.user.findUnique({ where: { clerkUserId } });
        if (existing) {
          const updatedUser = await db.user.update({
            where: { clerkUserId },
            data: { plan: mappedPlan }
          });
          return updatedUser;
        }
      } catch (dbErr) {
        console.warn("SyncUtility DB Update failed:", dbErr.message);
      }

      // Return a mock user object with the plan if not in DB yet
      return { clerkUserId, plan: mappedPlan };
    } else if (subscription.status !== 'active') {
       try {
         const existing = await db.user.findUnique({ where: { clerkUserId } });
         if (existing) {
          const updatedUser = await db.user.update({
            where: { clerkUserId },
            data: { plan: 'free_user' }
          });
          return updatedUser;
         }
       } catch (dbErr) {
          console.warn("SyncUtility DB Default failed:", dbErr.message);
       }
       return { clerkUserId, plan: 'free_user' };
    }
  } catch (error) {
    console.error("SyncUtility Error:", error.message);
  }
  return null;
}
