const https = require('https');

const projectRef = "ycverafomgclqvsjzhfw";
const token = "sbp_6431aaab7305a278becf8f3752bcdd746408b858";

async function mcpRequest(method, params, sessionId = null) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      jsonrpc: "2.0",
      id: Math.floor(Math.random() * 1000),
      method,
      params
    });

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Content-Length': data.length
    };
    if (sessionId) headers['Mcp-Session-Id'] = sessionId;

    const options = {
      hostname: 'mcp.supabase.com',
      path: `/mcp?project_ref=${projectRef}`,
      method: 'POST',
      headers
    };

    const req = https.request(options, (res) => {
      let body = '';
      const newSessionId = res.headers['mcp-session-id'];
      res.on('data', (d) => body += d);
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          resolve({ json, sessionId: newSessionId || sessionId });
        } catch (e) {
          reject(body);
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function run() {
  try {
    console.log("Initializing MCP...");
    const init = await mcpRequest("initialize", {
      protocolVersion: "2024-11-05",
      capabilities: {},
      clientInfo: { name: "Antigravity", version: "1.0.0" }
    });
    const sessionId = init.sessionId;
    console.log("Session ID:", sessionId);

    console.log("Listing tools...");
    const result = await mcpRequest("tools/list", {}, sessionId);

    console.log("Result:", JSON.stringify(result.json, null, 2));
  } catch (err) {
    console.error("Error:", err);
  }
}

run();
