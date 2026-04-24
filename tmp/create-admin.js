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

async function createAdmin() {
  const email = 'admin@tuproyecto.com';
  const password = 'admin123';
  
  console.log(`Creating user: ${email}`);
  
  const { data: { user }, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: 'Admin Global' }
  });

  if (error) {
    if (error.message.includes('already registered')) {
        console.log('User already exists in Auth.');
        return;
    }
    console.error('Error creating auth user:', error.message);
    return;
  }

  console.log(`User created in Auth with ID: ${user.id}`);

  // Create profile in User table
  const { error: profileError } = await supabase
    .from('User')
    .upsert({
      id: user.id,
      email,
      fullName: 'Admin Global',
      isActive: true,
      isSuper: true
    });

  if (profileError) {
    console.error('Error creating profile in User table:', profileError.message);
  } else {
    console.log('Profile created in User table successfully.');
  }

  // Assign SUPER_ADMIN role (ID 4)
  const { error: roleError } = await supabase
    .from('UserRole')
    .upsert({
      userId: user.id,
      roleId: 4 // SUPER_ADMIN
    });

  if (roleError) {
    console.error('Error assigning role:', roleError.message);
  } else {
    console.log('Role SUPER_ADMIN assigned successfully.');
  }
}

createAdmin();
