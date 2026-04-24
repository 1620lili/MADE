const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const env = fs.readFileSync('.env.local', 'utf8');
const getEnv = (key) => {
  const match = env.match(new RegExp(`${key}="(.*?)"`));
  return match ? match[1] : null;
};

const supabaseUrl = getEnv('NEXT_PUBLIC_SUPABASE_URL');
const supabaseAnonKey = getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY');

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function inspect() {
  const { data: roles, error: roleError } = await supabase.from('Role').select('*');
  if (roles) {
    fs.writeFileSync('tmp/roles.json', JSON.stringify(roles, null, 2));
    console.log('Roles written to tmp/roles.json');
  } else {
    console.log('Error fetching roles:', roleError?.message);
  }
}

inspect();
