const https = require('https');

const API_KEY = 'sk_test_CKxib4f9eStvL7MvJXs3ysQHDU1ky6SUBSyxa2sJz1';

const options = {
  hostname: 'api.clerk.com',
  port: 443,
  path: '/v1/subscriptions?limit=10',
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json'
  }
};

const req = https.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    const fs = require('fs');
    fs.writeFileSync('clerk_subscriptions.json', JSON.stringify(JSON.parse(data), null, 2));
    console.log('Finished fetching subscriptions');
  });
});

req.on('error', (e) => {
  console.error(e);
});

req.end();
