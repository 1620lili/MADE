import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; 

const supabase = createClient(supabaseUrl, supabaseKey);

async function listTables() {
  console.log('--- Listado de Tablas en Supabase (Public Schema) ---');
  
  const { data, error } = await supabase
    .rpc('get_tables'); // Trying a potential RPC if exists, otherwise raw query

  if (error) {
    // If RPC fails, try a direct query to information_schema
    const { data: tables, error: queryError } = await supabase
      .from('pg_catalog.pg_tables')
      .select('tablename')
      .eq('schemaname', 'public');

    if (queryError) {
       // Last resort: try to select from information_schema via a trick or just assume common ones
       const { data: infoTables, error: infoError } = await supabase.rpc('execute_sql', {
         sql: "SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public'"
       });
       
       if (infoError) {
         console.error('Error al listar las tablas:', infoError.message);
         // If all fails, manually check some
         const tableNames = ['user', 'role', 'user_role', 'company'];
         for (const name of tableNames) {
           const { error: checkError } = await supabase.from(name).select('*').limit(0);
           if (!checkError) console.log(`- ${name} (Existe)`);
           else console.log(`- ${name} (Error: ${checkError.message})`);
         }
       } else {
         infoTables.forEach(t => console.log(`- ${t.tablename}`));
       }
    } else {
      tables.forEach(t => console.log(`- ${t.tablename}`));
    }
  } else {
    data.forEach(t => console.log(`- ${t}`));
  }
}

listTables();
