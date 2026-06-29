'use server';

import { getServiceSupabase } from '@/lib/supabase';
import { verifySession } from '@/features/auth/session';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function createUser(prevState: any, formData: FormData) {
  const session = await verifySession();
  if (!session) return { error: 'No autorizado.' };

  const adminSupabase = getServiceSupabase();

  const fullName = formData.get('fullName') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const companyIdStr = formData.get('companyId') as string;
  const roleIdStr = formData.get('roleId') as string;
  const isActive = formData.get('isActive') === 'on';

  const companyId = companyIdStr ? parseInt(companyIdStr, 10) : null;
  const roleId = roleIdStr ? parseInt(roleIdStr, 10) : null;

  if (!fullName || !email || !password) {
    return { error: 'Todos los campos personales son obligatorios.' };
  }

  // RBAC: Only Super Admin or Company Owner can create users
  // (Simplificado: Solo Super Admin puede crear usuarios globales, Company Admin solo en su empresa)
  if (!session.isSuper && session.companyId !== companyId?.toString()) {
     return { error: 'No tienes permiso para crear usuarios en esta boutique.' };
  }

  try {
    // 1. Crear en Supabase Auth
    const { data: authData, error: authError } = await adminSupabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { fullName },
    });

    if (authError) throw authError;
    const userId = authData.user.id;

    // 2. Insertar en tabla User (pública)
    const { error: userError } = await adminSupabase
      .from('User')
      .insert({
        id: userId,
        email,
        fullName,
        password, // Requerido por el usuario (en texto plano/hash según su especificación)
        companyId,
        isActive,
        isSuper: false, // Por seguridad, la creación manual no asignaisSuper: true
      });

    if (userError) throw userError;

    // 3. Asignar a CompanyUser si aplica
    if (companyId) {
      const { error: cuError } = await adminSupabase
        .from('CompanyUser')
        .insert({ userId, companyId });
      
      if (cuError) console.error("Error en CompanyUser mapping:", cuError);

      // 4. Asignar Rol si aplica
      if (roleId) {
        const { error: urError } = await adminSupabase
          .from('UserRole')
          .insert({
            userId,
            roleId,
            companyId,
          });
        
        if (urError) console.error("Error en UserRole mapping:", urError);
      }
    }

  } catch (err: any) {
    console.error("User Creation Error:", err);
    if (err.message?.includes('email already exists')) {
      return { error: 'El correo electrónico ya está registrado.' };
    }
    return { error: 'Ocurrió un error interno al registrar el usuario.' };
  }

  const redirectPath = session.isSuper ? '/admin/usuarios' : '/dashboard/usuarios';
  revalidatePath(redirectPath);
  redirect(redirectPath);
}

export async function updateUserStatus(userId: string, isActive: boolean) {
  const session = await verifySession();
  if (!session) throw new Error('No autorizado');

  const adminSupabase = getServiceSupabase();

  try {
    // DB Update
    const { error: dbError } = await adminSupabase
      .from('User')
      .update({ isActive })
      .eq('id', userId);

    if (dbError) throw dbError;

    // Auth Update (Ban/Unban)
    // admin.updateUserById no tiene toggle directo de isActive pero podemos usar ban_duration o simplemente evitar login
    // El middleware ya debería validar isActive desde el perfil.
    await adminSupabase.auth.admin.updateUserById(userId, {
      ban_duration: isActive ? 'none' : '87600h', // 10 años de ban si no está activo
    });

  } catch (err) {
    console.error("Status Update Error:", err);
    throw err;
  }

  revalidatePath(session.isSuper ? '/admin/usuarios' : '/dashboard/usuarios');
}

export async function changePassword(userId: string, newPassword: string) {
  const session = await verifySession();
  if (!session) throw new Error('No autorizado');

  const adminSupabase = getServiceSupabase();

  try {
    // 1. Auth Update
    const { error: authError } = await adminSupabase.auth.admin.updateUserById(userId, {
      password: newPassword,
    });

    if (authError) throw authError;

    // 2. DB Update (Persistencia informativa solicitada)
    const { error: dbError } = await adminSupabase
      .from('User')
      .update({ password: newPassword })
      .eq('id', userId);

    if (dbError) throw dbError;

  } catch (err) {
    console.error("Password change error:", err);
    throw err;
  }
}

export async function assignRole(userId: string, roleId: number, companyId: number) {
  const session = await verifySession();
  if (!session) throw new Error('No autorizado');

  const adminSupabase = getServiceSupabase();

  try {
    // Cleanup existing roles in that company
    await adminSupabase.from('UserRole').delete().eq('userId', userId).eq('companyId', companyId);

    // Insert new role
    const { error } = await adminSupabase.from('UserRole').insert({
      userId,
      roleId,
      companyId,
    });

    if (error) throw error;

  } catch (err) {
    console.error("Assign Role error:", err);
    throw err;
  }

  revalidatePath(session.isSuper ? '/admin/usuarios' : '/dashboard/usuarios');
}

export async function updateRolePermissions(roleId: number, permissionIds: number[]) {
  const session = await verifySession();
  if (!session || !session.isSuper) throw new Error('Acceso denegado');

  const adminSupabase = getServiceSupabase();

  try {
    // Delete current permissions
    await adminSupabase.from('RolePermission').delete().eq('roleId', roleId);

    // Insert new ones
    if (permissionIds.length > 0) {
      const mappings = permissionIds.map(pId => ({ roleId, permissionId: pId }));
      const { error } = await adminSupabase.from('RolePermission').insert(mappings);
      if (error) throw error;
    }

  } catch (err) {
    console.error("Permission update error:", err);
    throw err;
  }

  revalidatePath('/admin/usuarios');
  return { success: true };
}

export async function updateUser(prevState: any, formData: FormData) {
  const session = await verifySession();
  if (!session) return { error: 'No autorizado.' };

  const adminSupabase = getServiceSupabase();
  const userId = formData.get('userId') as string;
  const fullName = formData.get('fullName') as string;
  const email = formData.get('email') as string;
  const companyIdStr = formData.get('companyId') as string;
  const roleIdStr = formData.get('roleId') as string;
  const isActive = formData.get('isActive') === 'true';
  const companyId = companyIdStr ? parseInt(companyIdStr, 10) : null;
  const roleId = roleIdStr ? parseInt(roleIdStr, 10) : null;

  try {
    // 1. UPDATE en Auth
    await adminSupabase.auth.admin.updateUserById(userId, { email });

    // 2. UPDATE en tabla User
    const { error: userError } = await adminSupabase
      .from('User')
      .update({ fullName, email, companyId, isActive })
      .eq('id', userId);
    if (userError) throw userError;

    // 3. UPDATE CompanyUser
    if (companyId) {
      await adminSupabase.from('CompanyUser')
        .upsert({ userId, companyId }, { onConflict: 'userId,companyId' });
    }

    // 4. UPDATE UserRole
    if (roleId && companyId) {
      await adminSupabase.from('UserRole').delete()
        .eq('userId', userId);
      await adminSupabase.from('UserRole').insert({ userId, roleId, companyId });
    }

    revalidatePath('/admin/usuarios');
    return { success: true };
  } catch (err: any) {
    return { error: err.message || 'Error al actualizar el usuario.' };
  }
}

export async function createRole(prevState: any, formData: FormData) {
  const session = await verifySession();
  if (!session || !session.isSuper) return { error: 'No autorizado.' };

  const name = formData.get('name') as string;
  const permissionIds = formData.getAll('permissions').map(p => parseInt(p as string));

  if (!name) return { error: 'El nombre del rol es obligatorio.' };

  const adminSupabase = getServiceSupabase();

  try {
    const { data: role, error } = await adminSupabase
      .from('Role')
      .insert({ name })
      .select()
      .single();

    if (error) throw error;

    if (permissionIds.length > 0) {
      await adminSupabase.from('RolePermission').insert(
        permissionIds.map(pId => ({ roleId: role.id, permissionId: pId }))
      );
    }

    revalidatePath('/admin/usuarios');
    return { success: true };
  } catch (err: any) {
    return { error: err.message || 'Error al crear el rol.' };
  }
}

export async function createPermission(prevState: any, formData: FormData) {
  const session = await verifySession();
  if (!session || !session.isSuper) return { error: 'No autorizado.' };

  const name = formData.get('name') as string;
  if (!name) return { error: 'El nombre del permiso es obligatorio.' };

  const adminSupabase = getServiceSupabase();

  try {
    const { error } = await adminSupabase
      .from('Permission')
      .insert({ name });

    if (error) throw error;

    revalidatePath('/admin/usuarios');
    return { success: true };
  } catch (err: any) {
    return { error: err.message || 'Error al crear el permiso.' };
  }
}
