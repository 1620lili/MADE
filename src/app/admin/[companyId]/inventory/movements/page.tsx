import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export const metadata = { title: 'LUXE ATELIER | Inventory Ledger' };

export default async function MovementsLogPage({ params }: { params: Promise<{ companyId: string }> }) {
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

  // Fetch Inventory Movements Data via Supabase
  const { data: movementsRaw, error: movementsError } = await supabase
    .from('InventoryMovement')
    .select(`
        *,
        ProductVariant (
            *,
            Product (*)
        ),
        User (fullName)
    `)
    .eq('companyId', companyIdNum)
    .order('createdAt', { ascending: false });

  if (movementsError) {
    console.error("Movements Fetch Error:", movementsError);
  }

  const movements = (movementsRaw || []) as any[];

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between md:items-end mb-16 gap-8">
        <div>
          <nav className="flex gap-2 text-[10px] tracking-[0.3em] uppercase text-on-surface-variant mb-4 font-label">
            <span>MANAGEMENT</span>
            <span>/</span>
            <Link href={`/admin/${companyIdNum}/inventory`} className="hover:text-secondary text-outline transition-colors">INVENTORY</Link>
            <span>/</span>
            <span className="text-secondary font-bold">LEDGER LOG</span>
          </nav>
          <h2 className="font-headline text-5xl tracking-tight text-on-surface">Entry <span className="italic text-on-surface-variant font-light">&amp;</span> Exit Log</h2>
        </div>
      </div>

      <div className="bg-surface-container-lowest overflow-hidden border border-outline-variant/15 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant/10">
                <th className="px-8 py-6 text-[10px] uppercase tracking-widest font-bold text-on-surface-variant font-label">Timeline</th>
                <th className="px-8 py-6 text-[10px] uppercase tracking-widest font-bold text-on-surface-variant font-label">Direction</th>
                <th className="px-8 py-6 text-[10px] uppercase tracking-widest font-bold text-on-surface-variant font-label">Piece / SKU</th>
                <th className="px-8 py-6 text-[10px] uppercase tracking-widest font-bold text-on-surface-variant text-right font-label">Volume</th>
                <th className="px-8 py-6 text-[10px] uppercase tracking-widest font-bold text-on-surface-variant text-right font-label">Auditor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              
              {movements.length === 0 ? (
                 <tr>
                    <td colSpan={5} className="px-8 py-16 text-center text-outline font-label text-xs uppercase tracking-widest">
                       The ledger has no recorded movements.
                    </td>
                 </tr>
              ) : (
                movements.map((record) => {
                  const dateObj = new Date(record.createdAt);
                  const dateStr = dateObj.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
                  const timeStr = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

                  const variant = record.ProductVariant;
                  const product = variant?.Product;

                  return (
                  <tr key={record.id} className="group hover:bg-surface-container-low transition-colors duration-300">
                    <td className="px-8 py-8 text-[11px] font-label text-on-surface-variant tracking-widest uppercase">
                        <span className="text-on-surface font-bold">{dateStr}</span> <br/> 
                        <span className="text-outline">{timeStr}</span>
                    </td>
                    <td className="px-8 py-8">
                      <div className="flex items-center gap-2">
                        {record.type === 'ENTRY' ? (
                            <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 px-3 py-1 font-label text-[9px] uppercase tracking-widest font-bold flex items-center gap-1">
                                <span className="material-symbols-outlined text-[10px]">arrow_downward</span> {record.type}
                            </span>
                        ) : (
                            <span className="bg-amber-100 text-amber-800 border border-amber-200 px-3 py-1 font-label text-[9px] uppercase tracking-widest font-bold flex items-center gap-1">
                                <span className="material-symbols-outlined text-[10px]">arrow_upward</span> {record.type}
                            </span>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-8">
                      <p className="font-headline text-lg tracking-tight text-on-surface">{product?.name || 'Unknown Piece'}</p>
                      <p className="text-[10px] uppercase tracking-widest text-on-surface-variant mt-1 font-mono">{variant?.sku}</p>
                    </td>
                    <td className="px-8 py-8 text-right font-headline text-xl text-on-surface font-light">
                        {record.type === 'ENTRY' ? '+' : '-'}{record.quantity}
                    </td>
                    <td className="px-8 py-8 text-right font-label text-[10px] tracking-widest uppercase text-on-surface-variant">
                        {record.User?.fullName}
                    </td>
                  </tr>
                )})
              )}

            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

