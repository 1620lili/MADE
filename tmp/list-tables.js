const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Basic env loading
function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const envFile = fs.readFileSync(envPath, 'utf8');
    envFile.split('\n').forEach(line => {
      const parts = line.split('=');
      if (parts.length === 2) {
        process.env[parts[0].trim()] = parts[1].trim();
      }
    });
  }
}

loadEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function listTables() {
  console.log('--- Listado de Tablas en Supabase (Public Schema) ---');
  
  // Direct check for tables we've been using or assuming
  const tableToCheck = ['user', 'role', 'user_role', 'company', 'Role', 'User', 'UserRole', 'Company'];
  
  for (const table of tableToCheck) {
    const { error } = await supabase.from(table).select('*').limit(0);
    if (!error) {
      console.log(`- ${table} (EXISTE)`);
    } else if (error.code !== '42P01') { // 42P01 is "undefined_table"
      console.log(`- ${table} (EXISTE pero con error: ${error.message})`);
    }
  }
}

listTables();
