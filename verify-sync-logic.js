const SECRET_KEY = "sk_test_CKxib4f9eStvL7MvJXs3ysQHDU1ky6SUBSyxa2sJz1";
const USER_ID = "user_3AYhQlOtzEHYukWUQxzauGjOdej"; 

async function syncTest() {
  try {
    console.log("Starting sync test for user:", USER_ID);
    const response = await fetch(`https://api.clerk.com/v1/users/${USER_ID}/billing/subscription`, {
      headers: {
        'Authorization': `Bearer ${SECRET_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
        console.error("Fetch failed:", response.status, response.statusText);
        return;
    }

    const subscription = await response.json();
    console.log("Subscription status:", subscription.status);

    const item = subscription?.subscription_items?.[0];
    const plan = item?.plan || subscription?.plan;
    
    if (subscription.status === 'active' && plan) {
      const planSlug = plan.slug;
      const planName = plan.name?.toLowerCase() || '';
      const planId = plan.id || '';

      console.log("Plan ID:", planId);
      console.log("Plan Slug:", planSlug);
      console.log("Plan Name:", planName);

      let mappedPlan = null;
      if (planSlug === 'pro' || planSlug === 'pro_plan') mappedPlan = 'pro';
      else if (planSlug === 'starter' || planSlug === 'starter_plan') mappedPlan = 'starter';
      
      if (!mappedPlan) {
        if (planName.includes('pro')) mappedPlan = 'pro';
        else if (planName.includes('starter')) mappedPlan = 'starter';
      }

      console.log("Final Mapped Plan:", mappedPlan);
    }
  } catch (e) {
    console.error("Sync test error:", e);
  }
}

syncTest();
