const { createClerkClient } = require("@clerk/backend");

const clerkClient = createClerkClient({ secretKey: "sk_test_CKxib4f9eStvL7MvJXs3ysQHDU1ky6SUBSyxa2sJz1" });

async function main() {
  console.log("ClerkClient keys:", Object.keys(clerkClient));
  if (clerkClient.users) {
    console.log("clerkClient.users keys:", Object.keys(clerkClient.users));
  }
}

main();
