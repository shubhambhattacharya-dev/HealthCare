const { createClerkClient } = require("@clerk/backend");

const clerkClient = createClerkClient({ secretKey: "sk_test_CKxib4f9eStvL7MvJXs3ysQHDU1ky6SUBSyxa2sJz1" });

function listMethods(obj, path = 'clerkClient') {
  const keys = Object.keys(obj);
  for (const key of keys) {
    const currentPath = `${path}.${key}`;
    if (typeof obj[key] === 'function') {
      console.log(`METHOD: ${currentPath}`);
    } else if (typeof obj[key] === 'object' && obj[key] !== null && path.split('.').length < 3) {
      listMethods(obj[key], currentPath);
    }
  }
}

async function main() {
  listMethods(clerkClient);
}

main();
