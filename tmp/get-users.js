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

async function getUsers() {
  const { data, error } = await supabase.from('User').select('email').limit(5);
  if (data) {
    console.log('Existing users:', data.map(u => u.email));
  } else {
    console.log('Error fetching users:', error.message);
  }
}

getUsers();
