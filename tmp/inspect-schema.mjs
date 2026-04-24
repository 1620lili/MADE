import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; 

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectSchema() {
  try {
    console.log('--- Inspecting Roles ---');
    let { data: roles, error: rolesError } = await supabase.from('role').select('*');
    if (rolesError) {
      console.log('role (lowercase) not found, trying Role (PascalCase)...');
      let { data: rolesPascal, error: rolesPascalError } = await supabase.from('Role').select('*');
      if (rolesPascalError) {
        console.error('Neither role nor Role found.');
      } else {
        console.log('Roles (PascalCase):', JSON.stringify(rolesPascal, null, 2));
      }
    } else {
      console.log('Roles (lowercase):', JSON.stringify(roles, null, 2));
    }

    console.log('\n--- Inspecting user table ---');
    let { data: users, error: usersError } = await supabase.from('user').select('*').limit(1);
    if (usersError) {
      console.log('user (lowercase) not found, trying User (PascalCase)...');
      let { data: UsersPascal, error: UsersPascalError } = await supabase.from('User').select('*').limit(1);
      if (UsersPascalError) {
        console.error('Neither user nor User found.');
      } else {
        console.log('User (PascalCase) columns:', Object.keys(UsersPascal[0] || {}));
      }
    } else {
      console.log('user (lowercase) columns:', Object.keys(users[0] || {}));
    }
    
    console.log('\n--- Checking user_role table ---');
    let { data: userRoles, error: urError } = await supabase.from('user_role').select('*').limit(1);
    if (urError) {
        console.log('user_role (lowercase) not found, trying UserRole (PascalCase)...');
        let { data: urPascal, error: urPascalError } = await supabase.from('UserRole').select('*').limit(1);
        if (urPascalError) {
            console.error('Neither user_role nor UserRole found.');
        } else {
            console.log('UserRole (PascalCase) columns:', Object.keys(urPascal[0] || {}));
        }
    } else {
        console.log('user_role (lowercase) columns:', Object.keys(userRoles[0] || {}));
    }

  } catch (e) {
    console.error('Unexpected error:', e);
  }
}

inspectSchema();
