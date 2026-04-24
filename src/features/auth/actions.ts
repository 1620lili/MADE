'use server';

import { createClient } from '@/utils/supabase/server';
import { getServiceSupabase } from '@/lib/supabase';
import { redirect } from 'next/navigation';

export async function login(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email y contraseña son requeridos.' };
  }

  const supabase = await createClient();

  try {
    const { data: { user: authUser }, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError) {
      return { error: `Error de Autenticación: ${loginError.message}` };
    }

    if (!authUser) return { error: 'No se pudo verificar la identidad del usuario.' };

    // Post-login check: Role and Company (Case Sensitive: PascalCase/camelCase)
    // Use Admin client to bypass RLS recursion
    const adminSupabase = getServiceSupabase();

    const { data: userData, error: userError } = await adminSupabase
      .from('User')
      .select('id, email, fullName, companyId, isSuper, isActive')
      .eq('id', authUser.id)
      .single();

    if (userError || !userData) {
      console.error("Fetch User Data Error:", userError);
      return { error: `Error de Perfil: ${userError?.message || 'Usuario no encontrado en la base de datos pública.'}` };
    }

    if (!userData.isActive) {
      return { error: 'Su cuenta se encuentra inactiva. Contacte al administrador.' };
    }

    // Get Role Name via UserRole junction
    const { data: userRoleData } = await adminSupabase
      .from('UserRole')
      .select('Role(name)')
      .eq('userId', authUser.id)
      .maybeSingle();

    const roleName = (userRoleData as any)?.Role?.name || (userData.isSuper ? 'SUPER_ADMIN' : null);

    // Dynamic Redirection
    if (roleName === 'SUPER_ADMIN' || userData.isSuper) {
      redirect('/admin');
    } else if (roleName === 'COMPANY_ADMIN') {
      if (userData.companyId) {
        redirect('/dashboard');
      } else {
        redirect('/onboarding/create-company');
      }
    } else {
      redirect('/');
    }

  } catch (err: any) {
    if (err.digest?.includes('NEXT_REDIRECT')) {
      throw err;
    }
    console.error("Login Error:", err);
    return { error: 'Error inesperado durante el login.' };
  }
}

export async function register(prevState: any, formData: FormData) {
  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const roleSelection = formData.get('role') as string; 

  if (!email || !password || !firstName || !lastName) {
    return { error: 'Todos los campos de usuario son obligatorios.' };
  }

  const fullName = `${firstName} ${lastName}`;
  const supabase = await createClient(); // Normal client for Auth
  const adminSupabase = getServiceSupabase(); // Admin client to bypass RLS

  try {
    // 1. Crear Auth User
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } }
    });

    if (authError) return { error: `Error Auth: ${authError.message}` };
    if (!authData.user) return { error: 'No se pudo crear el usuario en el sistema de autenticación.' };

    const userId = authData.user.id;

    if (roleSelection === 'Store Owner') {
      const companyName = formData.get('companyName') as string;
      const legalId = formData.get('legalId') as string;
      const legalRepresentative = formData.get('legalRepresentative') as string;
      const country = formData.get('country') as string;
      const city = formData.get('city') as string;
      const address = formData.get('address') as string;
      const phone = formData.get('phone') as string;

      if (!companyName || !legalId || !legalRepresentative) {
        return { error: 'Los datos de la empresa son requeridos (Nombre, NIT, Representante).' };
      }

      // 2. Insertar en tabla Company (USING ADMIN CLIENT)
      const { data: company, error: companyError } = await adminSupabase
        .from('Company')
        .insert({
          name: companyName,
          legalId,
          legalRepresentative,
          country,
          city,
          address,
          phone,
          email,
          isActive: true
        })
        .select()
        .single();

      if (companyError || !company) {
        console.error("Company Creation Error (Admin):", companyError);
        return { error: `Error Empresa: ${companyError?.message || 'Fallo desconocido al crear empresa'}` };
      }

      // New: Relation User-Company
      const { error: companyUserError } = await adminSupabase
        .from('CompanyUser')
        .insert({ userId, companyId: company.id });

      if (companyUserError) {
        console.error("CompanyUser Error:", companyUserError);
        return { error: `Error Relación Empresa: ${companyUserError.message}` };
      }

      // 3. Crear perfil en tabla User (USING ADMIN CLIENT)
      const { error: profileError } = await adminSupabase
        .from('User')
        .upsert({ 
          id: userId, 
          email, 
          fullName, 
          isActive: true,
          companyId: company.id 
        });

      if (profileError) {
        console.error("Profile Error (Admin):", profileError);
        return { error: `Error Perfil: ${profileError.message}` };
      }

      // 4. Crear relación en UserRole (USING ADMIN CLIENT)
      const { data: roleData, error: findRoleError } = await adminSupabase
        .from('Role')
        .select('id')
        .eq('name', 'COMPANY_ADMIN')
        .single();
      
      if (findRoleError || !roleData) {
        console.error("Role Find Error:", findRoleError);
        return { error: 'Error Roles: No se encontró el rol COMPANY_ADMIN en la base de datos.' };
      }

      const { error: roleRelationError } = await adminSupabase
        .from('UserRole')
        .insert({
          userId: userId,
          roleId: roleData.id,
          companyId: company.id
        });

      if (roleRelationError) {
        console.error("Role Relation Error:", roleRelationError);
        return { error: `Error Rol: ${roleRelationError.message}` };
      }

      redirect('/dashboard');
    } else {
      // Logic for Shopper
      const { error: profileError } = await adminSupabase
        .from('User')
        .upsert({ 
          id: userId, 
          email, 
          password, // Added password for Shopper
          fullName, 
          isActive: true 
        });

      if (profileError) return { error: `Error Perfil: ${profileError.message}` };
      
      redirect('/');
    }

  } catch (err: any) {
    if (err.digest?.includes('NEXT_REDIRECT')) throw err;
    console.error("Register Error:", err);
    return { error: 'Error inesperado durante el registro.' };
  }
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/auth');
}

