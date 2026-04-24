import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { getServiceSupabase } from "@/lib/supabase";

export type SessionPayload = {
  userId: string; // Changed to string for Supabase UUID
  email: string;
  isSuper: boolean;
  role: string;
  companyId: string;
};

export async function verifySession() {
  const supabase = await createClient();
  const adminSupabase = getServiceSupabase();
  
  const { data: { user: authUser }, error } = await supabase.auth.getUser();

  if (error || !authUser) {
    return null;
  }

  // Get profile data using Admin client to avoid RLS recursion
  const { data: profile } = await adminSupabase
    .from('User')
    .select('companyId, isSuper')
    .eq('id', authUser.id)
    .single();

  // Get Role Name via UserRole junction
  const { data: userRoleData } = await adminSupabase
    .from('UserRole')
    .select('Role(name)')
    .eq('userId', authUser.id)
    .maybeSingle();

  const roleName = (userRoleData as any)?.Role?.name || (profile?.isSuper ? 'SUPER_ADMIN' : null);

  return {
    userId: authUser.id,
    email: authUser.email!,
    role: roleName,
    companyId: profile?.companyId,
    isSuper: roleName === 'SUPER_ADMIN' || profile?.isSuper === true,
    profileExists: !!profile,
  };
}

export async function deleteSession() {
  const supabase = await createClient();
  await supabase.auth.signOut();
}

// These are legacy and no longer needed with Supabase SSR
export async function encrypt(payload: any) { return ""; }
export async function decrypt(session: string | undefined = "") { 
  if (!session) return null;
  try {
    // In some contexts, cookies() is not available (like middleware).
    // If decrypt is called from proxy.ts, we need to be careful.
    // However, if verifySession works, we use it.
    return await verifySession();
  } catch (e) {
    return null;
  }
}
export async function createSession(payload: any) { 
  // Supabase Auth manages its own session cookies
}

