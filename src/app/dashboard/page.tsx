import { verifySession } from "@/features/auth/session";
import { getServiceSupabase } from "@/lib/supabase";
import { redirect } from "next/navigation";
import Link from "next/link";

export const metadata = {
  title: "Dashboard Boutique | LUXE ATELIER",
};

export default async function CompanyDashboardPage() {
  const session = await verifySession();

  if (!session || !session.companyId) {
    redirect("/auth");
  }

  const adminSupabase = getServiceSupabase();
  const companyId = session.companyId;

  // 1. Fetch Company Info
  const { data: company } = await adminSupabase
    .from("Company")
    .select("*")
    .eq("id", companyId)
    .single();

  // 2. Fetch Inventory Metrics
  const { data: variants } = await adminSupabase
    .from('ProductVariant')
    .select('stock, price, productId, Product!inner(companyId)')
    .eq('Product.companyId', companyId);

  const totalStock = variants?.reduce((acc, v) => acc + (v.stock || 0), 0) || 0;
  const inventoryValue = variants?.reduce((acc, v) => acc + ((v.stock || 0) * (v.price || 0)), 0) || 0;
  const lowStockProducts = variants?.filter(v => (v.stock || 0) < 5).length || 0;

  // 3. Fetch Team Members
  const { data: teamMembers } = await adminSupabase
    .from('User')
    .select(`
      id, 
      fullName, 
      email, 
      isActive, 
      UserRole(Role(name))
    `)
    .eq('companyId', companyId)
    .eq('isActive', true)
    .limit(5);

  // 4. Fetch Recent Products
  const { data: recentProducts } = await adminSupabase
    .from('Product')
    .select(`
      id, 
      name, 
      brand, 
      isActive,
      ProductVariant(price, stock)
    `)
    .eq('companyId', companyId)
    .order('createdAt', { ascending: false })
    .limit(5);

  // 5. Fetch Recent Orders
  const { data: recentOrders } = await adminSupabase
    .from("Order")
    .select("*")
    .eq("companyId", companyId)
    .order("createdAt", { ascending: false })
    .limit(5);

  const productCount = recentProducts?.length || 0;

  return (
    <div className="space-y-16">
      {/* Welcome & Stats Row */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <header className="space-y-4">
           <div className="flex items-center space-x-3 text-secondary">
             <span className="material-symbols-outlined text-sm">auto_awesome</span>
             <span className="font-label text-[10px] uppercase tracking-[0.4em]">Panel de Gestión Boutique</span>
           </div>
           <h1 className="font-headline text-5xl lg:text-6xl tracking-tighter text-on-surface">{company?.name}</h1>
           <p className="text-on-surface-variant font-body text-lg max-w-xl">
             Bienvenido al centro de operaciones de tu boutique. Gestiona tu inventario, equipo y ventas desde aquí.
           </p>
        </header>

        <div className="flex bg-surface-container-low p-2 rounded-sm border border-outline-variant/10">
           <button className="px-6 py-2 bg-background text-[10px] font-label uppercase tracking-widest text-on-surface shadow-sm">Hoy</button>
           <button className="px-6 py-2 text-[10px] font-label uppercase tracking-widest text-on-surface-variant hover:text-on-surface transition-colors">Semana</button>
        </div>
      </div>

      {/* Stats Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="bg-surface-lowest p-8 border border-outline-variant/20 space-y-8 group hover:border-secondary transition-all">
          <div className="flex justify-between items-start">
             <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>payments</span>
             <span className="text-[10px] text-on-surface-variant font-bold tracking-widest">Valor Inventario</span>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-outline-variant font-bold mb-2">Capital en Stock</p>
            <h3 className="text-4xl font-headline tabular-nums">${inventoryValue.toLocaleString('es-CL', { minimumFractionDigits: 2 })}</h3>
          </div>
        </div>

        <div className="bg-surface-lowest p-8 border border-outline-variant/20 space-y-8 group hover:border-primary transition-all">
          <div className="flex justify-between items-start">
             <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>inventory_2</span>
             <span className="text-[10px] text-on-surface-variant font-bold tracking-widest">{totalStock} Unidades</span>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-outline-variant font-bold mb-2">Total Existencias</p>
            <h3 className="text-4xl font-headline tabular-nums">{totalStock}</h3>
          </div>
        </div>

        <div className="bg-surface-lowest p-8 border border-outline-variant/20 space-y-8 group hover:border-on-surface transition-all">
          <div className="flex justify-between items-start">
             <span className="material-symbols-outlined text-on-surface" style={{ fontVariationSettings: "'FILL' 1" }}>group</span>
             <span className="text-[10px] text-on-surface-variant font-bold tracking-widest">{teamMembers?.length || 0} Activos</span>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-outline-variant font-bold mb-2">Equipo Atelier</p>
            <h3 className="text-4xl font-headline tabular-nums">{teamMembers?.length || 0}</h3>
          </div>
        </div>

        <div className="bg-surface-lowest p-8 border border-outline-variant/20 space-y-8 group hover:border-error transition-all">
          <div className="flex justify-between items-start">
             <span className="material-symbols-outlined text-error" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
             <span className="text-[10px] text-on-surface-variant font-bold tracking-widest">Atención</span>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-outline-variant font-bold mb-2">Stock Bajo (&lt;5)</p>
            <h3 className="text-4xl font-headline tabular-nums text-error">{lowStockProducts}</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
        {/* Recent Activity Section */}
        <section className="xl:col-span-2 space-y-12">
           <div className="space-y-8">
              <div className="flex items-center justify-between border-b border-outline-variant/20 pb-4">
                <h2 className="font-headline text-2xl tracking-tight">Actividad de Ventas</h2>
                <Link href="/dashboard/ventas" className="text-[10px] font-label uppercase tracking-widest text-secondary hover:underline">Ver Todo</Link>
              </div>
              
              <div className="space-y-px bg-outline-variant/10 border border-outline-variant/10">
                {recentOrders?.map((order) => (
                  <div key={order.id} className="bg-surface-lowest p-6 flex justify-between items-center group hover:bg-surface-low transition-colors">
                    <div className="flex items-center space-x-4">
                       <div className="w-10 h-10 bg-surface-container-low flex items-center justify-center rounded-full">
                          <span className="material-symbols-outlined text-on-surface-variant text-base">shopping_bag</span>
                       </div>
                       <div>
                          <p className="text-sm font-headline tracking-tighter">Pedido #{order.id.toString().substring(0,6)}</p>
                          <p className="text-[10px] font-label uppercase tracking-widest text-secondary">
                             {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="text-sm font-label font-bold">${order.totalAmount?.toLocaleString('es-CL') || '0.00'}</p>
                       <p className="text-[8px] uppercase tracking-widest text-on-surface-variant">{order.status || 'Procesando'}</p>
                    </div>
                  </div>
                ))}
                {(!recentOrders || recentOrders.length === 0) && (
                  <div className="bg-surface-lowest p-12 text-center">
                    <span className="material-symbols-outlined text-4xl text-outline-variant mb-4 opacity-50">history</span>
                    <p className="text-xs text-on-surface-variant font-label uppercase tracking-[0.2em]">No hay ventas recientes</p>
                  </div>
                )}
              </div>
           </div>

           <div className="space-y-8">
              <div className="flex items-center justify-between border-b border-outline-variant/20 pb-4">
                <h2 className="font-headline text-2xl tracking-tight">Mi Equipo</h2>
                <Link href="/dashboard/usuarios" className="text-[10px] font-label uppercase tracking-widest text-secondary hover:underline">Ver Equipo Completo</Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {teamMembers?.map((member) => (
                  <div key={member.id} className="bg-surface-lowest p-6 border border-outline-variant/10 flex items-center space-x-4">
                    <div className="w-12 h-12 bg-surface-container-low rounded-full flex items-center justify-center font-headline italic text-lg border border-outline-variant/10">
                      {member.fullName?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <p className="text-sm font-label font-bold text-on-surface">{member.fullName}</p>
                      <p className="text-[10px] text-on-surface-variant tracking-wider">{member.email}</p>
                      <p className="text-[8px] uppercase tracking-widest text-secondary mt-1">{(member.UserRole as any)?.[0]?.Role?.name || 'Miembro'}</p>
                    </div>
                  </div>
                ))}
              </div>
           </div>

           <div className="space-y-8">
              <div className="flex items-center justify-between border-b border-outline-variant/20 pb-4">
                <h2 className="font-headline text-2xl tracking-tight">Productos Recientes</h2>
                <Link href="/dashboard/inventario" className="text-[10px] font-label uppercase tracking-widest text-secondary hover:underline">Ver Inventario</Link>
              </div>
              
              <div className="space-y-px bg-outline-variant/10 border border-outline-variant/10">
                {recentProducts?.map((product) => {
                  const variants = product.ProductVariant as any[];
                  const minPrice = variants?.length > 0 ? Math.min(...variants.map(v => v.price)) : 0;
                  const totalStock = variants?.reduce((acc, v) => acc + v.stock, 0) || 0;
                  
                  return (
                    <div key={product.id} className="bg-surface-lowest p-6 flex justify-between items-center group hover:bg-surface-low transition-colors">
                      <div className="flex items-center space-x-4">
                         <div className="w-10 h-10 bg-surface-container-low flex items-center justify-center rounded-sm border border-outline-variant/10">
                            <span className="material-symbols-outlined text-on-surface-variant text-base">apparel</span>
                         </div>
                         <div>
                            <p className="text-sm font-headline tracking-tighter">{product.name}</p>
                            <p className="text-[10px] font-label uppercase tracking-widest text-secondary">
                               {product.brand}
                            </p>
                         </div>
                      </div>
                      <div className="text-right">
                         <p className="text-sm font-label font-bold">Desde ${minPrice.toLocaleString('es-CL')}</p>
                         <p className="text-[8px] uppercase tracking-widest text-on-surface-variant">{totalStock} en stock</p>
                      </div>
                    </div>
                  );
                })}
              </div>
           </div>
        </section>

        {/* Quick Links / Actions */}
        <section className="space-y-8">
           <div className="flex items-center justify-between border-b border-outline-variant/20 pb-4">
              <h2 className="font-headline text-2xl tracking-tight">Accesos Directos</h2>
           </div>
           
           <div className="grid grid-cols-1 gap-4">
              <Link href="/dashboard/inventario/nuevo" className="p-6 bg-surface-lowest border border-outline-variant/10 hover:border-secondary transition-all flex items-center justify-between group">
                 <div className="flex items-center space-x-4">
                    <span className="material-symbols-outlined text-secondary">add_circle</span>
                    <span className="text-[10px] font-label uppercase tracking-widest">Agregar Producto</span>
                 </div>
                 <span className="material-symbols-outlined text-sm opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
              </Link>
              <Link href="/dashboard/usuarios/nuevo" className="p-6 bg-surface-lowest border border-outline-variant/10 hover:border-secondary transition-all flex items-center justify-between group">
                 <div className="flex items-center space-x-4">
                    <span className="material-symbols-outlined text-secondary">person_add</span>
                    <span className="text-[10px] font-label uppercase tracking-widest">Invitar al Equipo</span>
                 </div>
                 <span className="material-symbols-outlined text-sm opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
              </Link>
              <Link href="/dashboard/informes" className="p-6 bg-surface-lowest border border-outline-variant/10 hover:border-secondary transition-all flex items-center justify-between group">
                 <div className="flex items-center space-x-4">
                    <span className="material-symbols-outlined text-secondary">analytics</span>
                    <span className="text-[10px] font-label uppercase tracking-widest">Ver Reportes</span>
                 </div>
                 <span className="material-symbols-outlined text-sm opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
              </Link>
           </div>
        </section>
      </div>
    </div>
  );
}

