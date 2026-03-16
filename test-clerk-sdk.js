const { createClerkClient } = require("@clerk/clerk-sdk-node");

const clerkClient = createClerkClient({ secretKey: "sk_test_CKxib4f9eStvL7MvJXs3ysQHDU1ky6SUBSyxa2sJz1" });

async function test() {
  try {
    const userId = "user_39zVEPy8ycPl02pcK4vdWzk2jQm"; // The user from logs
    // Testing if this method exists or what the structure is
    console.log("Checking for billing methods...");
    console.log("Users keys:", Object.keys(clerkClient.users));
    
    // Some versions might have it under user.getOrganizationBillingSubscription or similar
    // For users it might be different in newer SDKs
  } catch (e) {
    console.error(e);
  }
}

test();
