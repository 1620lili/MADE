import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { CreateProductForm } from '@/components/inventory/CreateProductForm';
import Link from 'next/link';

export const metadata = { title: 'LUXE ATELIER | Catalog Piece' };

export default async function NewInventoryPage({ params }: { params: Promise<{ companyId: string }> }) {
  const supabase = await createClient();
  
  const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
  if (authError || !authUser) redirect('/auth');

  const resolvedParams = await params;
  const companyIdNum = parseInt(resolvedParams.companyId, 10);

  // RBAC Access Verification via Supabase
  const { data: membership } = await supabase
    .from('UserRole')
    .select('roleId')
    .eq('userId', authUser.id)
    .eq('companyId', companyIdNum)
    .maybeSingle();

  const { data: profile } = await supabase
    .from('User')
    .select('isSuper')
    .eq('id', authUser.id)
    .single();

  if (!membership && !profile?.isSuper) redirect('/dashboard');

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between md:items-end mb-16 gap-8">
        <div>
          <nav className="flex gap-2 text-[10px] tracking-[0.3em] uppercase text-on-surface-variant mb-4 font-label">
            <span>MANAGEMENT</span>
            <span>/</span>
            <Link href={`/admin/${companyIdNum}/inventory`} className="hover:text-secondary transition-colors text-outline">INVENTORY</Link>
            <span>/</span>
            <span className="text-secondary font-bold">NEW PIECE</span>
          </nav>
        </div>
      </div>
      
      <div className="flex justify-center">
         <CreateProductForm companyId={companyIdNum} />
      </div>
    </>
  );
}

