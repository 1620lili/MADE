'use server';

import { createClient } from '@/utils/supabase/server';
import { getServiceSupabase } from '@/lib/supabase';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { verifySession } from '../auth/session';

export async function createCompany(prevState: any, formData: FormData) {
  const supabase = await createClient();

  // 1. Session Validation
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { error: 'Sesión no válida o expirada. Por favor, inicia sesión de nuevo.' };
  }

  // Extract fields
  const name = formData.get('name') as string;
  const logoUrl = formData.get('logoUrl') as string;
  const bannerUrl = formData.get('bannerUrl') as string;
  const legalId = formData.get('legalId') as string;
  const legalRepresentative = formData.get('legalRepresentative') as string;
  const country = formData.get('country') as string;
  const city = formData.get('city') as string;
  const address = formData.get('address') as string;
  const phone = formData.get('phone') as string;
  const email = formData.get('email') as string;
  const isActive = formData.get('isActive') === 'true';

  // Basic validation
  if (!name || !legalId || !legalRepresentative || !address || !phone || !email) {
    return { error: 'Los campos marcados como obligatorios son necesarios para el registro.' };
  }

  try {
    const adminSupabase = getServiceSupabase();

    // 2. ATOMIC STEP 1: Insert into Company
    const { data: company, error: companyError } = await adminSupabase
      .from('Company')
      .insert({
        name,
        logoUrl,
        bannerUrl,
        legalId,
        legalRepresentative,
        country,
        city,
        address,
        phone,
        email,
        isActive: true,
      })
      .select()
      .single();

    if (companyError || !company) {
      console.error('Company creation error:', companyError);
      if (companyError?.code === '23505') { // Unique violation code
        return { error: 'Ya existe una marca registrada con este ID Legal.' };
      }
      return { error: 'Error al crear la marca.' };
    }

    const companyId = company.id;

    // 3. ATOMIC STEP 2: Insert into CompanyUser (Relationship)
    const { error: companyUserError } = await adminSupabase
      .from('CompanyUser')
      .insert({
        userId: user.id,
        companyId: companyId,
      });

    if (companyUserError) {
      console.error('CompanyUser error:', companyUserError);
      return { error: 'Error al vincular el usuario con la empresa.' };
    }

    // 4. ATOMIC STEP 3: Fetch 'COMPANY_ADMIN' role
    const { data: roleData, error: roleSearchError } = await adminSupabase
      .from('Role')
      .select('id')
      .eq('name', 'COMPANY_ADMIN')
      .single();

    if (roleSearchError || !roleData) {
      console.error('Role search error:', roleSearchError);
      return { error: 'Error al buscar el rol administrativo.' };
    }

    // 5. ATOMIC STEP 4: Assign Administrative Role
    const { error: roleError } = await adminSupabase
      .from('UserRole')
      .insert({
        userId: user.id,
        companyId: companyId,
        roleId: roleData.id,
      });

    if (roleError) {
      console.error('UserRole error:', roleError);
      return { error: 'Error al asignar roles administrativos.' };
    }

    // 6. ATOMIC STEP 5: Update the User with the new companyId
    const { error: userUpdateError } = await adminSupabase
      .from('User')
      .update({ companyId: companyId })
      .eq('id', user.id);

    if (userUpdateError) {
      console.error("User Update Error:", userUpdateError);
      return { error: 'Error al vincular tu cuenta con la nueva marca.' };
    }

  } catch (err: any) {
    if (err.digest?.includes('NEXT_REDIRECT')) {
      throw err;
    }
    console.error("Create Company Unexpected Error:", err);
    return { error: 'Fallo crítico en el sistema. Intente de nuevo.' };
  }

  // 5. Redirect to the dashboard
  redirect('/dashboard');
}

export async function createCompanyAdmin(prevState: any, formData: FormData) {
  const session = await verifySession();
  
  if (!session || !session.isSuper) {
    return { error: 'No tienes permisos para realizar esta acción.' };
  }

  // Extract fields
  const name = formData.get('name') as string;
  const legalId = formData.get('legalId') as string;
  const legalRepresentative = formData.get('legalRepresentative') as string;
  const email = formData.get('email') as string;
  const phone = formData.get('phone') as string;
  const country = formData.get('country') as string;
  const city = formData.get('city') as string;
  const address = formData.get('address') as string;
  const logoUrl = formData.get('logoUrl') as string;
  const bannerUrl = formData.get('bannerUrl') as string;
  const isActive = formData.get('isActive') === 'on' || formData.get('isActive') === 'true';

  // Validation
  if (!name || !legalId || !legalRepresentative || !country || !city) {
    return { error: 'Los campos marcados como obligatorios son necesarios.' };
  }

  try {
    const adminSupabase = getServiceSupabase();

    const { data: company, error: companyError } = await adminSupabase
      .from('Company')
      .insert({
        name,
        legalId,
        legalRepresentative,
        email: email || null,
        phone: phone || null,
        country,
        city,
        address: address || null,
        logoUrl: logoUrl || null,
        bannerUrl: bannerUrl || null,
        isActive,
      })
      .select()
      .single();

    if (companyError) {
      console.error('Admin Company creation error:', companyError);
      if (companyError.code === '23505') {
        return { error: 'Ya existe una empresa con ese NIT/Identificación Legal.' };
      }
      return { error: 'Error al registrar la empresa en la base de datos.' };
    }

    revalidatePath('/admin/empresas');
    revalidatePath('/admin');
    revalidatePath('/');

    return { success: true, company };
  } catch (err: any) {
    console.error("Admin Create Company Unexpected Error:", err);
    return { error: 'Error al registrar la empresa. Intente de nuevo.' };
  }
}

export async function updateCompany(prevState: any, formData: FormData) {
  const session = await verifySession();
  
  if (!session || !session.isSuper) {
    return { error: 'No tienes permisos para realizar esta acción.' };
  }

  const id = parseInt(formData.get('id') as string);
  const name = formData.get('name') as string;
  const legalId = formData.get('legalId') as string;
  const legalRepresentative = formData.get('legalRepresentative') as string;
  const email = formData.get('email') as string;
  const phone = formData.get('phone') as string;
  const country = formData.get('country') as string;
  const city = formData.get('city') as string;
  const address = formData.get('address') as string;
  const logoUrl = formData.get('logoUrl') as string;
  const bannerUrl = formData.get('bannerUrl') as string;
  const isActive = formData.get('isActive') === 'on' || formData.get('isActive') === 'true';

  if (!id || !name || !legalId || !legalRepresentative || !country || !city) {
    return { error: 'Los campos marcados como obligatorios son necesarios.' };
  }

  try {
    const adminSupabase = getServiceSupabase();

    const { error: updateError } = await adminSupabase
      .from('Company')
      .update({
        name,
        legalId,
        legalRepresentative,
        email: email || null,
        phone: phone || null,
        country,
        city,
        address: address || null,
        logoUrl: logoUrl || null,
        bannerUrl: bannerUrl || null,
        isActive,
      })
      .eq('id', id);

    if (updateError) {
      console.error('Update Company Error:', updateError);
      return { error: 'Error al actualizar la empresa en la base de datos.' };
    }

    revalidatePath('/admin/empresas');
    revalidatePath('/');
    
    return { success: true };
  } catch (err: any) {
    console.error("Update Company Unexpected Error:", err);
    return { error: 'Error inesperado al actualizar la empresa.' };
  }
}

export async function toggleCompanyStatus(companyId: number, isActive: boolean) {
  const session = await verifySession();
  
  if (!session || !session.isSuper) {
    throw new Error('No autorizado');
  }

  try {
    const adminSupabase = getServiceSupabase();
    const newStatus = !isActive;

    const { error } = await adminSupabase
      .from('Company')
      .update({ isActive: newStatus })
      .eq('id', companyId);

    if (error) {
      console.error('Toggle Company Status Error:', error);
      throw new Error('Error al cambiar el estado de la empresa');
    }

    revalidatePath('/admin/empresas');
    revalidatePath('/');

    return { success: true, newStatus };
  } catch (err: any) {
    console.error("Toggle Company Unexpected Error:", err);
    throw err;
  }
}

export async function getCompanies() {
  const session = await verifySession();
  
  if (!session || !session.isSuper) {
    throw new Error('No autorizado');
  }

  const adminSupabase = getServiceSupabase();
  const { data: companies, error } = await adminSupabase
    .from('Company')
    .select('*')
    .order('createdAt', { ascending: false });

  if (error) {
    console.error('Fetch Companies Error:', error);
    throw new Error('Error al obtener empresas');
  }

  return companies;
}
