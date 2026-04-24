import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { InventoryRowActions } from '@/components/inventory/InventoryRowActions';

export const metadata = { title: 'LUXE ATELIER | Inventory' };

export default async function InventoryOverviewPage({ params }: { params: Promise<{ companyId: string }> }) {
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

  // Fetch Inventory Data via Supabase
  const { data: productsRaw, error: productError } = await supabase
    .from('Product')
    .select(`
      id,
      name,
      brand,
      isActive,
      ProductVariant (*)
    `)
    .eq('companyId', companyIdNum)
    .eq('isActive', true)
    .order('createdAt', { ascending: false });

  if (productError) {
    console.error("Inventory Fetch Error:", productError);
  }

  const products = (productsRaw || []) as any[];

  // Calculate Metrics
  let totalStockValue = 0;
  let totalVariants = 0;
  
  // Flattening variants for table rendering
  const allVariants = products.flatMap(p => 
    (p.ProductVariant || []).map((v: any) => {
      totalStockValue += (v.price * v.stock);
      totalVariants++;
      return { ...v, product: p };
    })
  );

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  return (
    <>
      {/* Breadcrumbs & Title */}
      <div className="flex flex-col md:flex-row justify-between md:items-end mb-16 gap-8">
        <div>
          <nav className="flex gap-2 text-[10px] tracking-[0.3em] uppercase text-on-surface-variant mb-4 font-label">
            <span>MANAGEMENT</span>
            <span>/</span>
            <span className="text-secondary font-bold">INVENTORY</span>
          </nav>
          <h2 className="font-headline text-5xl tracking-tight text-on-surface">Curated Collection</h2>
        </div>
        <div className="flex gap-4">
          <Link href={`/admin/${companyIdNum}/inventory/movements`} className="bg-surface border border-outline-variant/30 text-on-surface px-8 py-5 text-xs font-bold uppercase tracking-[0.2em] font-label flex items-center justify-center gap-3 transition-all duration-300 hover:bg-surface-variant active:scale-95 shadow-sm">
            <span className="material-symbols-outlined text-sm">history</span>
            Ledger Log
          </Link>
          <Link href={`/admin/${companyIdNum}/inventory/new`} className="bg-primary text-on-primary px-10 py-5 text-xs font-bold uppercase tracking-[0.2em] font-label flex items-center justify-center gap-3 transition-all duration-300 hover:bg-secondary active:scale-95 shadow-md">
            <span className="material-symbols-outlined text-sm">add</span>
            Añadir Nueva Pieza
          </Link>
        </div>
      </div>

      {/* Filters & Stats Bento */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="md:col-span-2 bg-surface-container-low p-8 flex flex-col justify-between group shadow-sm">
          <div className="flex justify-between items-start mb-8">
            <span className="text-[10px] tracking-widest uppercase text-on-surface-variant font-label">Active Filters</span>
            <button className="text-[10px] font-bold uppercase tracking-widest text-secondary underline underline-offset-4 font-label">Clear</button>
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="relative w-full md:w-auto">
              <label className="block text-[9px] uppercase tracking-widest text-on-surface-variant mb-2 font-label">Category</label>
              <select className="appearance-none bg-transparent border-t-0 border-x-0 border-b border-outline-variant py-2 pr-10 text-sm font-headline focus:ring-0 focus:border-secondary w-full cursor-pointer outline-none">
                <option>ALL CATEGORIES</option>
                <option>ALTA JOYERÍA</option>
                <option>RELOJERÍA FINA</option>
              </select>
              <span className="material-symbols-outlined absolute right-0 bottom-2 text-sm pointer-events-none text-outline">expand_more</span>
            </div>
          </div>
        </div>
        
        <div className="bg-primary text-on-primary p-8 flex flex-col justify-between shadow-sm">
          <span className="text-[10px] tracking-widest uppercase opacity-70 font-label">Total Stock Value</span>
          <div className="mt-4">
            <span className="font-headline text-3xl">{formatCurrency(totalStockValue)}</span>
            <div className="flex items-center gap-1 text-[10px] text-secondary-container mt-1 font-label uppercase tracking-widest">
              <span className="material-symbols-outlined text-xs">trending_up</span>
              <span>LIVE VALUATION</span>
            </div>
          </div>
        </div>
        
        <div className="bg-secondary p-8 flex flex-col justify-between text-on-secondary shadow-sm">
          <span className="text-[10px] tracking-widest uppercase opacity-70 font-label">Unique Pieces</span>
          <div className="mt-4">
            <span className="font-headline text-3xl">{totalVariants}</span>
            <div className="flex items-center gap-1 text-[10px] mt-1 opacity-80 font-label uppercase tracking-widest">
              <span>ACTIVE SKUS</span>
            </div>
          </div>
        </div>
      </div>

      {/* Inventory Table Section */}
      <div className="bg-surface-container-lowest overflow-hidden border border-outline-variant/15 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant/10">
                <th className="px-8 py-6 text-[10px] uppercase tracking-widest font-bold text-on-surface-variant font-label">SKU</th>
                <th className="px-8 py-6 text-[10px] uppercase tracking-widest font-bold text-on-surface-variant font-label">Piece</th>
                <th className="px-8 py-6 text-[10px] uppercase tracking-widest font-bold text-on-surface-variant font-label">Collection</th>
                <th className="px-8 py-6 text-[10px] uppercase tracking-widest font-bold text-on-surface-variant font-label">Status</th>
                <th className="px-8 py-6 text-[10px] uppercase tracking-widest font-bold text-on-surface-variant text-right font-label">Retail Price</th>
                <th className="px-8 py-6 text-[10px] uppercase tracking-widest font-bold text-on-surface-variant text-right font-label">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              
              {allVariants.length === 0 ? (
                 <tr>
                    <td colSpan={6} className="px-8 py-16 text-center text-outline font-label text-xs uppercase tracking-widest">
                       The vault is currently empty.
                    </td>
                 </tr>
              ) : (
                allVariants.map((item) => (
                  <tr key={item.id} className="group hover:bg-surface-container-low transition-colors duration-300">
                    <td className="px-8 py-8 text-[11px] font-mono tracking-tighter text-on-surface-variant">{item.sku}</td>
                    <td className="px-8 py-8">
                      <div className="flex items-center gap-6">
                        <div className="h-16 w-12 bg-surface-container overflow-hidden flex-shrink-0">
                          {item.imageUrl ? (
                             <img src={item.imageUrl} alt={item.product.name} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                          ) : (
                             <div className="w-full h-full bg-surface-container-highest flex items-center justify-center text-outline">
                                <span className="material-symbols-outlined text-sm">image</span>
                             </div>
                          )}
                        </div>
                        <div>
                          <p className="font-headline text-lg tracking-tight group-hover:text-secondary transition-colors">{item.product.name}</p>
                          <p className="text-[10px] uppercase tracking-widest text-on-surface-variant mt-1 font-label">{item.color || 'Onyx'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-8 text-sm font-headline italic text-on-surface">{item.product.brand || 'Heritage'}</td>
                    <td className="px-8 py-8">
                      <div className="flex items-center gap-2">
                        <span className={`h-1.5 w-1.5 rounded-full ${item.stock > 0 ? 'bg-emerald-600' : 'bg-red-600'}`}></span>
                        <span className={`text-[10px] font-bold uppercase tracking-widest font-label ${item.stock > 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                           {item.stock > 0 ? 'En Stock' : 'Agotado'} ({item.stock})
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-8 text-right font-headline text-lg text-on-surface">{formatCurrency(item.price)}</td>
                    <td className="px-8 py-8 text-right">
                      <InventoryRowActions variantId={item.id} companyId={companyIdNum} />
                    </td>
                  </tr>
                ))
              )}

            </tbody>
          </table>
        </div>
        
        {/* Pagination Dummy */}
        {allVariants.length > 0 && (
            <div className="px-8 py-6 flex flex-col md:flex-row justify-between items-center border-t border-outline-variant/10 gap-4">
            <span className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-label">Mostrando 1-{allVariants.length} de {allVariants.length} piezas</span>
            <div className="flex gap-2">
                <button className="h-8 w-8 flex items-center justify-center border border-outline-variant/30 hover:bg-on-background hover:text-background transition-all">
                <span className="material-symbols-outlined text-sm">chevron_left</span>
                </button>
                <button className="h-8 w-8 flex items-center justify-center bg-primary text-on-primary font-label text-[10px] font-bold">1</button>
                <button className="h-8 w-8 flex items-center justify-center border border-outline-variant/30 hover:bg-on-background hover:text-background transition-all">
                <span className="material-symbols-outlined text-sm">chevron_right</span>
                </button>
            </div>
            </div>
        )}
      </div>
    </>
  );
}

