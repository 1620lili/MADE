import { getServiceSupabase } from './src/lib/supabase.ts';
import dotenv from 'dotenv';
dotenv.config();

async function checkRoles() {
  const supabase = getServiceSupabase();
  const { data: roles, error } = await supabase.from('Role').select('*');
  if (error) {
    console.error('Error fetching roles:', error);
    return;
  }
  console.log('Existing Roles:', JSON.stringify(roles, null, 2));

  const { data: permissions, error: pError } = await supabase.from('Permission').select('*');
  if (pError) {
     console.error('Error fetching permissions:', pError);
  } else {
     console.log('Existing Permissions:', JSON.stringify(permissions, null, 2));
  }
}

checkRoles();
