const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const envFile = fs.readFileSync(envPath, 'utf8');
    envFile.split('\n').forEach(line => {
      const parts = line.split('=');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const value = parts.slice(1).join('=').trim().replace(/^"|"$/g, '');
        process.env[key] = value;
      }
    });
  }
}

loadEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function listAllData() {
  const tables = ['Role', 'Company', 'User', 'UserRole'];
  
  for (const table of tables) {
    console.log(`\n=== TABLA: ${table} ===`);
    const { data, error } = await supabase.from(table).select('*').limit(10);
    if (error) {
      console.error(`Error al leer ${table}:`, error.message);
    } else {
      console.log(JSON.stringify(data, null, 2));
    }
  }
}

listAllData();
