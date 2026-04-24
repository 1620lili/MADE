import { createClient } from '@/utils/supabase/server';
import { getServiceSupabase } from '@/lib/supabase';
import { redirect } from 'next/navigation';
import { InviteUserForm } from '@/components/admin/InviteUserForm';

export const metadata = { title: 'LUXE ATELIER | Team Directory' };

export default async function TeamManagementPage({ params }: { params: Promise<{ companyId: string }> }) {
  const supabase = await createClient();
  const adminSupabase = getServiceSupabase();
  
  const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
  if (authError || !authUser) redirect('/auth');

  const resolvedParams = await params;
  const companyIdNum = parseInt(resolvedParams.companyId, 10);

  // Verify access privileges via Admin Supabase to bypass RLS recursion
  const { data: membership } = await adminSupabase
    .from('UserRole')
    .select('*, Role(*)')
    .eq('userId', authUser.id)
    .eq('companyId', companyIdNum)
    .maybeSingle();

  const { data: profile } = await adminSupabase
    .from('User')
    .select('isSuper')
    .eq('id', authUser.id)
    .single();

  if (!membership && !profile?.isSuper) redirect('/dashboard');

  const isOwner = (membership?.Role as any)?.name === 'Owner' || profile?.isSuper;

  // Retrieve existing active staff members via Admin Supabase
  const { data: teamMembersRaw, error: teamError } = await adminSupabase
    .from('UserRole')
    .select(`
      userId,
      roleId,
      Role (id, name),
      User (id, fullName, email)
    `)
    .eq('companyId', companyIdNum);

  if (teamError) {
    console.error("Team Fetch Error:", teamError);
  }

  const teamMembers = (teamMembersRaw || []) as any[];

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between md:items-end mb-16 gap-6">
        <div>
          <p className="text-[10px] tracking-[0.3em] uppercase text-secondary font-label">Team Directory</p>
          <h2 className="text-4xl md:text-5xl font-headline text-on-surface leading-tight mt-2">Boutique Personnel</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        {/* Active Personnel Roster */}
        <div className="lg:col-span-2 space-y-4">
          {teamMembers.map(member => (
            <div key={`${member.userId}-${member.roleId}`} className="p-6 bg-surface-container-compact hover:bg-surface-container transition-colors flex justify-between items-center shadow-sm border border-transparent hover:border-outline-variant/10">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-surface-container-highest flex items-center justify-center font-headline text-lg text-on-surface rounded-full">
                   {member.User?.fullName?.charAt(0) || '?'}
                </div>
                <div>
                  <h4 className="font-headline text-lg text-on-surface mb-1">{member.User?.fullName}</h4>
                  <p className="text-[10px] font-label text-outline uppercase tracking-widest">{member.User?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="px-4 py-1.5 bg-background border border-outline-variant/30 font-label text-[9px] uppercase tracking-widest text-on-surface-variant">
                    {member.Role?.name}
                </span>
                {isOwner && member.userId !== authUser.id && (
                  <button className="text-outline-variant hover:text-error transition-colors material-symbols-outlined text-md">person_remove</button>
                )}
              </div>
            </div>
          ))}
          {teamMembers.length === 0 && (
             <div className="text-center py-12 bg-surface-container-low font-label text-xs uppercase tracking-widest text-on-surface-variant">
                 No personnel assigned yet.
             </div>
          )}
        </div>

        {/* Dynamic Recruitment Form */}
        {isOwner && <InviteUserForm companyId={companyIdNum} />}
      </div>
    </>
  );
}

