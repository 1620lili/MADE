const https = require('https');

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InljdmVyYWZvbWdjbHF2c2p6aGZ3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDM2NjQ1MCwiZXhwIjoyMDg5OTQyNDUwfQ.u64EL7bNTbfTicCInW4Hqa_Dw8XzzTXo5y_5CplscbY";

const options = {
  hostname: 'ycverafomgclqvsjzhfw.supabase.co',
  path: '/rest/v1/',
  method: 'GET',
  headers: {
    'apikey': token,
    'Authorization': `Bearer ${token}`
  }
};

const req = https.request(options, (res) => {
  let body = '';
  res.on('data', (d) => body += d);
  res.on('end', () => {
    try {
      const json = JSON.parse(body);
      // The OpenAPI definition at the root lists all tables
      const tables = json.definitions ? Object.keys(json.definitions) : [];
      console.log(JSON.stringify(tables, null, 2));
    } catch (e) {
      console.error("Error parsing response:", e);
      console.log(body);
    }
  });
});

req.on('error', console.error);
req.end();
