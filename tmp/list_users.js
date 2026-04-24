const { createClient } = require('@supabase/ssr');
const { createClient: createSupabaseClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error("Missing env vars", { supabaseUrl, serviceKey: !!serviceKey });
  process.exit(1);
}

const supabase = createSupabaseClient(supabaseUrl, serviceKey);

async function run() {
  const { data, error } = await supabase.from('User').select('email, fullName, isSuper').limit(10);
  if (error) {
    console.error(error);
  } else {
    console.log(JSON.stringify(data, null, 2));
  }
}

run();
