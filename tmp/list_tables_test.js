
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function listTables() {
  const { data, error } = await supabase
    .rpc('get_tables'); // Attempt RPC if exists

  if (error) {
    // Fallback to direct query if possible, but PostgREST doesn't support raw SQL easily
    // We can try to query a known table or search for metadata
    console.log('Error calling RPC get_tables, trying to query information_schema via REST if allowed...');
    
    // Most Supabase setups don't allow querying information_schema via PostgREST by default.
    // However, we can try to guess or use the CLI if it were there.
    // Since I must use "available tools", and the MCP is missing, I'll try to use the client to at least verify the ones I found.
    
    const tablesToCheck = ['User', 'UserRole', 'Company', 'Product', 'ProductVariant', 'Role', 'InventoryMovement'];
    console.log('Checking presence of tables via direct query (LIMIT 0):');
    for (const table of tablesToCheck) {
      const { error: tableError } = await supabase.from(table).select('*').limit(0);
      if (!tableError) {
        console.log(`- ${table} (Exists)`);
      } else {
        console.log(`- ${table} (Error or Missing: ${tableError.message})`);
      }
    }
  } else {
    console.log('Tables found via RPC:', data);
  }
}

listTables();
