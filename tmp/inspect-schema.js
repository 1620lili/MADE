import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // Use service role to inspect

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectSchema() {
  console.log('--- Inspecting Roles ---');
  const { data: roles, error: rolesError } = await supabase.from('role').select('*');
  if (rolesError) {
    console.error('Error fetching role table (lowercase):', rolesError.message);
    const { data: rolesPascal, error: rolesPascalError } = await supabase.from('Role').select('*');
    if (rolesPascalError) {
      console.error('Error fetching Role table (PascalCase):', rolesPascalError.message);
    } else {
      console.log('Roles (PascalCase):', rolesPascal);
    }
  } else {
    console.log('Roles (lowercase):', roles);
  }

  console.log('\n--- Inspecting User/user table columns ---');
  // We can try to get a single row to see columns
  const { data: userRow, error: userError } = await supabase.from('user').select('*').limit(1);
  if (userError) {
    console.error('Error fetching user table (lowercase):', userError.message);
    const { data: UserRow, error: UserPascalError } = await supabase.from('User').select('*').limit(1);
    if (UserPascalError) {
        console.error('Error fetching User table (PascalCase):', UserPascalError.message);
    } else {
        console.log('User (PascalCase) columns:', Object.keys(UserRow[0] || {}));
    }
  } else {
    console.log('user (lowercase) columns:', Object.keys(userRow[0] || {}));
  }
}

inspectSchema();
