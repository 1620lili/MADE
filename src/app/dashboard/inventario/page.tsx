import { verifySession } from "@/features/auth/session";
import { getServiceSupabase } from "@/lib/supabase";
import { redirect } from "next/navigation";
import Link from "next/link";
import InventoryGrid from "@/components/inventory/InventoryGrid";

export const metadata = {
  title: "Inventario Boutique | LUXE ATELIER",
};

export default async function CompanyInventoryPage() {
  const session = await verifySession();

  if (!session || !session.companyId) {
    redirect("/auth");
  }

  const adminSupabase = getServiceSupabase();
  const companyId = session.companyId;

  // 1. Fetch products with full details
  const { data: products } = await adminSupabase
    .from("Product")
    .select(`
      id, name, brand, isActive, createdAt, description,
      ProductVariant(id, sku, price, stock, color, size, imageUrl),
      ProductImage(url, isMain)
    `)
    .eq('companyId', companyId)
    .order('createdAt', { ascending: false });

  // 2. Calculate Metrics
  const activeProducts = products?.filter(p => p.isActive).length || 0;
  const allVariants = products?.flatMap(p => (p.ProductVariant as any[]) || []) || [];
  const totalSkus = allVariants.length;
  const inventoryValue = allVariants.reduce((acc, v) => acc + (v.price * v.stock), 0);
  const lowStockCount = allVariants.filter(v => v.stock < 5).length;

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-outline-variant/20 pb-10">
        <div className="space-y-4">
           <div className="flex items-center space-x-3 text-secondary">
             <span className="material-symbols-outlined text-sm">inventory_2</span>
             <span className="font-label text-[10px] uppercase tracking-[0.4em]">Gestión de Stock</span>
           </div>
           <h1 className="font-headline text-5xl lg:text-6xl tracking-tighter text-on-surface">Inventario</h1>
           <p className="text-on-surface-variant font-body text-lg max-w-xl">
             Control de existencias de tu boutique. Gestiona tus colecciones y disponibilidad en tiempo real.
           </p>
        </div>
        
        <Link 
          href="/dashboard/inventario/nuevo" 
          className="bg-on-surface text-surface px-8 py-4 text-[10px] tracking-widest uppercase font-label font-bold hover:bg-secondary transition-all shadow-lg hover:shadow-secondary/20 flex items-center space-x-3"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          <span>Agregar Producto</span>
        </Link>
      </header>

      {/* Quick Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-surface-lowest p-6 border border-outline-variant/10 space-y-4">
          <p className="text-[8px] font-label uppercase tracking-widest text-on-surface-variant">Productos Activos</p>
          <p className="text-3xl font-headline italic">{activeProducts}</p>
        </div>
        <div className="bg-surface-lowest p-6 border border-outline-variant/10 space-y-4">
          <p className="text-[8px] font-label uppercase tracking-widest text-on-surface-variant">Total SKUs</p>
          <p className="text-3xl font-headline italic">{totalSkus}</p>
        </div>
        <div className="bg-surface-lowest p-6 border border-outline-variant/10 space-y-4">
          <p className="text-[8px] font-label uppercase tracking-widest text-on-surface-variant">Valor Total</p>
          <p className="text-3xl font-headline italic">${inventoryValue.toLocaleString('es-CL')}</p>
        </div>
        <div className="bg-surface-lowest p-6 border border-outline-variant/10 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-[8px] font-label uppercase tracking-widest text-on-surface-variant">Stock Bajo (&lt;5)</p>
            {lowStockCount > 0 && <span className="w-2 h-2 bg-error rounded-full animate-pulse"></span>}
          </div>
          <p className={`text-3xl font-headline italic ${lowStockCount > 0 ? 'text-error' : ''}`}>{lowStockCount}</p>
        </div>
      </div>

      {/* Product Grid (Client Component) */}
      <InventoryGrid products={products || []} />
    </div>
  );
}
