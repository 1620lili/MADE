const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://ycverafomgclqvsjzhfw.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InljdmVyYWZvbWdjbHF2c2p6aGZ3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDM2NjQ1MCwiZXhwIjoyMDg5OTQyNDUwfQ.u64EL7bNTbfTicCInW4Hqa_Dw8XzzTXo5y_5CplscbY";

const supabase = createClient(supabaseUrl, supabaseKey);

async function listTables() {
  const { data, error } = await supabase.rpc('execute_sql', {
    sql: "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE';"
  });

  if (error) {
    // If RPC doesn't exist, try direct SQL if possible, or just a simple query
    console.error('Error:', error);
    const { data: tables, error: err2 } = await supabase
      .from('pg_tables') // This might not work due to RLS/Permissions
      .select('tablename')
      .eq('schemaname', 'public');
    
    if (err2) {
      console.error('Error 2:', err2);
      // Try to find any table to see if it works
      const { data: d3, error: e3 } = await supabase.from('_prisma_migrations').select('*').limit(1);
      if (!e3) console.log('Found table: _prisma_migrations');
    } else {
      console.log('Tables:', tables);
    }
  } else {
    console.log('Tables:', data);
  }
}

listTables();
