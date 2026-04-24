import { createClient } from '@/utils/supabase/server';
import { getServiceSupabase } from '@/lib/supabase';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function AdminLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ companyId: string }>;
}) {
  const supabase = await createClient();
  const adminSupabase = getServiceSupabase();
  
  const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
  if (authError || !authUser) redirect('/auth');

  // Next.js 15: params is a promise
  const resolvedParams = await params;
  const companyIdNum = parseInt(resolvedParams.companyId, 10);
  if (isNaN(companyIdNum)) redirect('/dashboard');

  // RBAC: Verify if the user has a Role in this specific company via Admin Supabase
  const { data: userRoleData, error: roleError } = await adminSupabase
    .from('UserRole')
    .select(`
      roleId,
      Role (name),
      Company (name)
    `)
    .eq('userId', authUser.id)
    .eq('companyId', companyIdNum)
    .maybeSingle();

  // Also check if user is a Super Admin in their profile via Admin Client
  const { data: profile } = await adminSupabase
    .from('User')
    .select('isSuper')
    .eq('id', authUser.id)
    .single();

  if (!userRoleData && !profile?.isSuper) {
    redirect('/dashboard');
  }

  const companyName = userRoleData?.Company && !Array.isArray(userRoleData.Company) 
    ? (userRoleData.Company as any).name 
    : 'Super Admin Override';
    
  const roleName = userRoleData?.Role && !Array.isArray(userRoleData.Role) 
    ? (userRoleData.Role as any).name 
    : 'Super Admin';

  return (
    <div className="bg-background text-on-background min-h-screen flex selection:bg-secondary-container selection:text-secondary-dim">

      {/* SideNavBar Shell */}
      <aside className="hidden md:flex flex-col h-screen w-72 left-0 fixed border-r-0 bg-surface-container-low dark:bg-stone-900 py-12 px-8 z-50">
        <div className="mb-12">
          <h1 className="text-xl font-headline text-on-surface truncate">{companyName}</h1>
          <p className="uppercase text-[10px] tracking-widest text-secondary mt-1 font-label">{roleName}</p>
        </div>

        <nav className="flex-1 space-y-2">
          <Link href={`/admin/${companyIdNum}/dashboard`} className="flex items-center gap-4 px-4 py-3 text-on-surface-variant hover:bg-surface-variant/50 transition-all duration-300 font-label text-sm tracking-tight rounded-sm">
            <span className="material-symbols-outlined">dashboard</span>
            <span>Dashboard</span>
          </Link>
          <Link href={`/admin/${companyIdNum}/inventory`} className="flex items-center gap-4 px-4 py-3 text-on-surface-variant hover:bg-surface-variant/50 transition-all duration-300 font-label text-sm tracking-tight rounded-sm">
            <span className="material-symbols-outlined">inventory_2</span>
            <span>Inventory</span>
          </Link>
          <Link href={`/admin/${companyIdNum}/analytics`} className="flex items-center gap-4 px-4 py-3 text-on-surface-variant hover:bg-surface-variant/50 transition-all duration-300 font-label text-sm tracking-tight rounded-sm">
            <span className="material-symbols-outlined">analytics</span>
            <span>Analytics</span>
          </Link>

          {/* Active Tab Logic can be handled with headers or layout matching */}
          <Link href={`/admin/${companyIdNum}`} className="flex items-center gap-4 px-4 py-3 text-on-surface font-bold bg-surface-variant transition-all duration-300 rounded-sm">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>storefront</span>
            <span className="font-headline text-lg">Boutiques</span>
          </Link>

          <Link href={`/admin/${companyIdNum}/users`} className="flex items-center gap-4 px-4 py-3 text-on-surface-variant hover:bg-surface-variant/50 transition-all duration-300 font-label text-sm tracking-tight rounded-sm">
            <span className="material-symbols-outlined">group</span>
            <span>Team & Users</span>
          </Link>
          <a href={`/boutique/${companyIdNum}`} target="_blank" className="flex items-center gap-4 px-4 py-3 text-secondary hover:text-on-surface hover:bg-surface-variant/50 transition-all duration-300 font-label text-sm tracking-tight rounded-sm mt-4">
            <span className="material-symbols-outlined">visibility</span>
            <span>Visit Storefront</span>
          </a>
        </nav>

        <div className="mt-auto pt-8 border-t border-outline-variant/20">
          <Link href="/dashboard" className="w-full py-4 text-xs tracking-widest uppercase bg-primary text-on-primary hover:bg-secondary transition-colors duration-300 font-label font-bold flex justify-center text-center shadow-lg">
            Return to Hub
          </Link>
        </div>
      </aside>

      {/* Main Canvas */}
      <main className="flex-1 md:ml-72 bg-background min-h-screen">

        {/* TopAppBar Shell */}
        <header className="flex justify-between items-center px-6 md:px-10 py-6 w-full sticky top-0 z-40 bg-background/90 dark:bg-stone-950/90 backdrop-blur-xl border-b border-outline-variant/15">
          <div className="flex items-center">
            <img src="/image/made-logo.jpeg" alt="MADE" className="h-8 w-auto" />
          </div>
          <div className="flex items-center gap-8">
            <div className="relative hidden lg:block">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-outline material-symbols-outlined text-sm">search</span>
              <input className="bg-surface-container-low border-0 border-b border-outline-variant/30 focus:ring-0 focus:border-secondary pl-10 pr-4 py-2 text-[10px] tracking-widest w-64 uppercase outline-none transition-colors" placeholder="SEARCH DIRECTORY..." type="text" />
            </div>
            <div className="flex items-center gap-4 text-on-surface-variant">
              <button className="material-symbols-outlined hover:text-secondary transition-colors duration-300 scale-100 active:scale-95">notifications</button>
              <button className="material-symbols-outlined hover:text-secondary transition-colors duration-300 scale-100 active:scale-95">settings</button>
              <div className="w-10 h-10 bg-surface-container-highest overflow-hidden border border-outline-variant/20">
                <img alt="User" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCh1KZ1V5_fHA0pLQKfMtVgQSo7q_4tsB6j2iNPtAXpo3rasgpy-V6Zt6NiTP_HRA1Azy7ifoPSJQwflMjyPxBeXUpHTpB7bU2oMD0TkWJKpqiaPZLipkeYihl8F_aI655knR5Bj4BEMEpNqG-78G3Yp61TzB-n_hVN-l7mwK-GAkt-3YCrgcuJPqxWBgVl7X1knshWO3qIHFlF33MzcaV6Hq64s1dSVJxlJq_kOJHq0h-giQtz4DLQ94DOWYsVm2jfTmPCN29hmCc" />
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content Area */}
        <div className="p-6 md:p-10 max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      {/* Floating Action Button - Mobile Only */}
      <div className="fixed bottom-10 right-6 z-50 md:hidden">
        <button className="w-14 h-14 bg-on-surface text-surface shadow-2xl flex items-center justify-center hover:bg-secondary transition-colors">
          <span className="material-symbols-outlined">menu</span>
        </button>
      </div>

    </div>
  );
}

