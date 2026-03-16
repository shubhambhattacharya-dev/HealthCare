const https = require('https');

const SECRET_KEY = "sk_test_CKxib4f9eStvL7MvJXs3ysQHDU1ky6SUBSyxa2sJz1";
const USER_ID = "user_39zVEPy8ycPl02pcK4vdWzk2jQm"; // From previous user list

const options = {
  hostname: 'api.clerk.com',
  port: 443,
  path: `/v1/users/${USER_ID}/billing/subscription`,
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${SECRET_KEY}`,
    'Content-Type': 'application/json'
  }
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log("RESPONSE:", data);
  });
});

req.on('error', (e) => { console.error("ERROR:", e); });
req.end();
