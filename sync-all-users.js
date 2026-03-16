const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Mimic the syncUserPlan logic but for Node.js
async function syncUserPlan(clerkUserId) {
  try {
    const response = await fetch(`https://api.clerk.com/v1/users/${clerkUserId}/billing/subscription`, {
      headers: {
        'Authorization': `Bearer sk_test_CKxib4f9eStvL7MvJXs3ysQHDU1ky6SUBSyxa2sJz1`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) return null;

    const subscription = await response.json();
    const item = subscription?.subscription_items?.[0];
    const plan = item?.plan || subscription?.plan;
    
    if (subscription.status === 'active' && plan) {
      const planName = plan.name?.toLowerCase() || '';
      const planId = plan.id || '';
      const planSlug = plan.slug || '';

      const PLAN_MAP = {
        "cplan_3AOmqeky2uwLmoH7ElUqSQYh6y8": "pro",
        "cplan_3AOmJIZs0w9Bq8OCDMqkomATB61": "starter",
        "cplan_3AOqkomATB61": "starter",
        "cplan_3AOUqSQYh6y8": "pro",
      };

      let mappedPlan = PLAN_MAP[planId];
      if (!mappedPlan) {
        if (planSlug.includes('pro') || planName.includes('pro')) mappedPlan = 'pro';
        else if (planSlug.includes('starter') || planName.includes('starter')) mappedPlan = 'starter';
        else mappedPlan = 'free_user';
      }

      await prisma.user.update({
        where: { clerkUserId },
        data: { plan: mappedPlan }
      });
      return mappedPlan;
    }
  } catch (error) {
    console.error(`Error syncing ${clerkUserId}:`, error.message);
  }
  return 'free_user';
}

async function main() {
  const users = await prisma.user.findMany({
    where: { role: { in: ['PATIENT', 'ADMIN'] } }
  });

  console.log(`Checking ${users.length} users...`);

  for (const user of users) {
    process.stdout.write(`Syncing ${user.email}... `);
    const plan = await syncUserPlan(user.clerkUserId);
    console.log(`DONE (${plan})`);
  }
  
  console.log("\nSync complete! Now run your app and refresh to see credits.");
}

main()
