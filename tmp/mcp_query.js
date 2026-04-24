const https = require('https');

const data = JSON.stringify({
  jsonrpc: "2.0",
  id: 1,
  method: "callTool",
  params: {
    name: "execute_sql",
    arguments: {
      sql: "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE';"
    }
  }
});

const options = {
  hostname: 'mcp.supabase.com',
  path: '/mcp?project_ref=ycverafomgclqvsjzhfw',
  method: 'POST',
  headers: {
    'Authorization': 'Bearer sbp_6431aaab7305a278becf8f3752bcdd746408b858',
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = https.request(options, (res) => {
  let body = '';
  res.on('data', (d) => {
    body += d;
  });
  res.on('end', () => {
    console.log(body);
  });
});

req.on('error', (error) => {
  console.error(error);
});

req.write(data);
req.end();
