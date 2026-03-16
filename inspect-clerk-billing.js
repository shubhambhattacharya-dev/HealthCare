const { createClerkClient } = require("@clerk/backend");

const clerkClient = createClerkClient({ secretKey: "sk_test_CKxib4f9eStvL7MvJXs3ysQHDU1ky6SUBSyxa2sJz1" });

async function main() {
  console.log("ClerkClient Users Methods:");
  const usersMethods = Object.keys(clerkClient.users);
  usersMethods.forEach(method => console.log(` - users.${method}`));
  
  if (clerkClient.organizations) {
     console.log("ClerkClient Organizations Methods:");
     Object.keys(clerkClient.organizations).forEach(method => console.log(` - organizations.${method}`));
  }
}

main();
