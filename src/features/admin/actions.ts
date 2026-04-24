'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function inviteUser(prevState: any, formData: FormData) {
  const supabase = await createClient();
  
  const { data: { user: currentUser }, error: authError } = await supabase.auth.getUser();
  if (authError || !currentUser) return { error: 'Unauthorized' };

  const companyId = parseInt(formData.get('companyId') as string, 10);
  const email = formData.get('email') as string;
  const roleName = formData.get('roleName') as string;

  if (isNaN(companyId) || !email || !roleName) {
    return { error: 'Missing required credentials.' };
  }

  try {
    // 1. Check RBAC: is current user Owner or Super?
    const { data: callerRole } = await supabase
      .from('UserRole')
      .select('Role(name)')
      .eq('userId', currentUser.id)
      .eq('companyId', companyId)
      .single();

    const { data: profile } = await supabase
      .from('User')
      .select('isSuper')
      .eq('id', currentUser.id)
      .single();

    const isOwner = (callerRole as any)?.Role?.name === 'Owner';
    
    if (!profile?.isSuper && !isOwner) {
      return { error: 'Only owners can recruit personnel.' };
    }

    // 2. Find target user in public.User
    const { data: targetUser, error: targetError } = await supabase
      .from('User')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (targetError || !targetUser) {
      return { error: 'User not found in global directory. They must register first.' };
    }

    // 3. Find or create role
    let { data: role } = await supabase
      .from('Role')
      .select('id')
      .eq('name', roleName)
      .maybeSingle();

    if (!role) {
      return { error: 'Failed to identify or create the specified role.' };
    }

    // 4. Assign company user mapping (CompanyUser)
    const { error: companyUserError } = await supabase
      .from('CompanyUser')
      .upsert({ userId: targetUser.id, companyId }, { onConflict: 'userId,companyId' });

    if (companyUserError) throw companyUserError;

    // 5. Create UserRole mapping
    const { error: userRoleError } = await supabase
      .from('UserRole')
      .insert({
        userId: targetUser.id,
        roleId: role.id,
        companyId,
      });


    if (userRoleError) {
      if (userRoleError.code === '23505') {
        return { error: 'User already holds a role in this boutique.' };
      }
      throw userRoleError;
    }

    revalidatePath(`/admin/${companyId}/users`);
    return { error: '' };
  } catch (err: any) {
    console.error("Invite Error:", err);
    return { error: 'Internal system error.' };
  }
}

