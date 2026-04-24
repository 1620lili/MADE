import { verifySession } from "@/features/auth/session";
import { getServiceSupabase } from "@/lib/supabase";
import { redirect } from "next/navigation";
import Link from "next/link";

export const metadata = {
  title: "Dashboard Central | LUXE ATELIER",
};

export default async function AdminDashboard() {
  const session = await verifySession();

  if (!session || !session.isSuper) {
    redirect("/auth");
  }

  const adminSupabase = getServiceSupabase();

  // 1. Fetch Key Metrics
  const { data: companies } = await adminSupabase.from("Company").select("*");
  const { data: users } = await adminSupabase.from("User").select("id");
  const { data: products } = await adminSupabase.from("Product").select("id");
  const { data: orders } = await adminSupabase
    .from("Order")
    .select("*, Company(name)")
    .order("createdAt", { ascending: false })
    .limit(5);

  const stats = {
    totalCompanies: companies?.length || 0,
    totalUsers: users?.length || 0,
    totalProducts: products?.length || 0,
    activeCompanies: companies?.filter(c => c.isActive).length || 0
  };

  return (
    <div className="space-y-16">
      {/* Welcome & Stats Row */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <header className="space-y-4">
           <div className="flex items-center space-x-3 text-secondary">
             <span className="material-symbols-outlined text-sm">auto_awesome</span>
             <span className="font-label text-[10px] uppercase tracking-[0.4em]">Panel de Control Global</span>
           </div>
           <h1 className="font-headline text-5xl lg:text-6xl tracking-tighter text-on-surface">Atelier Overview</h1>
           <p className="text-on-surface-variant font-body text-lg max-w-xl">
             Consola central de operaciones. Monitoreo en tiempo real de la red global de boutiques.
           </p>
        </header>

        <div className="flex bg-surface-container-low p-2 rounded-sm border border-outline-variant/10">
           <button className="px-6 py-2 bg-background text-[10px] font-label uppercase tracking-widest text-on-surface shadow-sm">Hoy</button>
           <button className="px-6 py-2 text-[10px] font-label uppercase tracking-widest text-on-surface-variant hover:text-on-surface transition-colors">Semana</button>
           <button className="px-6 py-2 text-[10px] font-label uppercase tracking-widest text-on-surface-variant hover:text-on-surface transition-colors">Mes</button>
        </div>
      </div>

      {/* Stats Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="bg-surface-lowest p-8 border border-outline-variant/20 space-y-8 group hover:border-secondary transition-all">
          <div className="flex justify-between items-start">
             <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>payments</span>
             <span className="text-[10px] text-on-surface-variant font-bold tracking-widest">+12.4%</span>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-outline-variant font-bold mb-2">Ingresos Estimados</p>
            <h3 className="text-4xl font-headline tabular-nums">$2.4M</h3>
          </div>
        </div>

        <div className="bg-surface-lowest p-8 border border-outline-variant/20 space-y-8 group hover:border-primary transition-all">
          <div className="flex justify-between items-start">
             <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>storefront</span>
             <span className="text-[10px] text-on-surface-variant font-bold tracking-widest">{stats.activeCompanies} Activos</span>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-outline-variant font-bold mb-2">Boutiques Miembros</p>
            <h3 className="text-4xl font-headline tabular-nums">{stats.totalCompanies}</h3>
          </div>
        </div>

        <div className="bg-surface-lowest p-8 border border-outline-variant/20 space-y-8 group hover:border-on-surface transition-all">
          <div className="flex justify-between items-start">
             <span className="material-symbols-outlined text-on-surface" style={{ fontVariationSettings: "'FILL' 1" }}>inventory_2</span>
             <span className="text-[10px] text-on-surface-variant font-bold tracking-widest">Global</span>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-outline-variant font-bold mb-2">Artículos en Red</p>
            <h3 className="text-4xl font-headline tabular-nums">{stats.totalProducts}</h3>
          </div>
        </div>

        <div className="bg-surface-lowest p-8 border border-outline-variant/20 space-y-8 group hover:border-secondary transition-all">
          <div className="flex justify-between items-start">
             <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>group</span>
             <span className="text-[10px] text-on-surface-variant font-bold tracking-widest">Colectivo</span>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-outline-variant font-bold mb-2">Usuarios Totales</p>
            <h3 className="text-4xl font-headline tabular-nums">{stats.totalUsers}</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
        {/* Main Chart Mock Area (Revenue) */}
        <section className="xl:col-span-2 space-y-8">
           <div className="flex items-center justify-between border-b border-outline-variant/20 pb-4">
              <h2 className="font-headline text-2xl tracking-tight">Rendimiento Financiero</h2>
              <button className="text-[10px] font-label uppercase tracking-widest text-secondary hover:underline">Descargar Reporte</button>
           </div>
           
           <div className="bg-surface-lowest border border-outline-variant/10 aspect-[16/7] relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-t from-surface-low/30 to-transparent"></div>
              {/* Visual placeholder for Chart */}
              <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-20 transition-opacity">
                 <span className="material-symbols-outlined text-[120px]">show_chart</span>
              </div>
              <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
                 <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                       <span className="w-3 h-3 bg-secondary rounded-full"></span>
                       <span className="text-[10px] font-label uppercase tracking-widest">Ventas de Colección</span>
                    </div>
                    <p className="text-[10px] text-on-surface-variant max-w-xs">Análisis predictivo basado en el comportamiento del mercado actual en las capitales de la moda.</p>
                 </div>
                 <div className="text-right">
                    <span className="font-headline text-3xl">$42,850.00</span>
                    <p className="text-[10px] uppercase tracking-widest text-on-surface-variant">Promedio Diario</p>
                 </div>
              </div>
           </div>
        </section>

        {/* Recent Transactions / Feed Sidebar */}
        <section className="space-y-8">
           <div className="flex items-center justify-between border-b border-outline-variant/20 pb-4">
              <h2 className="font-headline text-2xl tracking-tight">Actividad Reciente</h2>
              <Link href="/admin/sales" className="text-[10px] font-label uppercase tracking-widest text-secondary hover:underline">Ver Todo</Link>
           </div>
           
           <div className="space-y-px bg-outline-variant/10 border border-outline-variant/10">
              {orders?.map((order) => (
                <div key={order.id} className="bg-surface-lowest p-6 flex justify-between items-center group hover:bg-surface-low transition-colors">
                  <div className="flex items-center space-x-4">
                     <div className="w-10 h-10 bg-surface-container-low flex items-center justify-center rounded-full">
                        <span className="material-symbols-outlined text-on-surface-variant text-base">shopping_bag</span>
                     </div>
                     <div>
                        <p className="text-sm font-headline tracking-tighter">Pedido #{order.id.toString().substring(0,6)}</p>
                        <p className="text-[10px] font-label uppercase tracking-widest text-secondary">{(order.Company as any)?.name}</p>
                     </div>
                  </div>
                  <div className="text-right">
                     <p className="text-sm font-label font-bold">${(order as any).totalAmount || '0.00'}</p>
                     <p className="text-[8px] uppercase tracking-widest text-on-surface-variant">{(order as any).status || 'Procesando'}</p>
                  </div>
                </div>
              ))}
              {(!orders || orders.length === 0) && (
                <div className="bg-surface-lowest p-12 text-center">
                  <span className="material-symbols-outlined text-4xl text-outline-variant mb-4 opacity-50">history</span>
                  <p className="text-xs text-on-surface-variant font-label uppercase tracking-[0.2em]">No hay ventas recientes</p>
                </div>
              )}
           </div>
        </section>
      </div>

      {/* Global Boutique Map / Distribution Section */}
      <section className="space-y-8">
         <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-outline-variant/20 pb-4 gap-4">
            <div>
               <h2 className="font-headline text-2xl tracking-tight">Distribución del Colectivo</h2>
               <p className="text-[10px] text-outline-variant uppercase tracking-widest mt-1">Presencia global de LUXE ATELIER</p>
            </div>
            <div className="flex items-center space-x-8">
               <div className="flex items-center space-x-3">
                  <span className="w-2 h-2 bg-secondary rounded-full"></span>
                  <span className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">Europa (42%)</span>
               </div>
               <div className="flex items-center space-x-3">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  <span className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">América (28%)</span>
               </div>
            </div>
         </div>

         <div className="bg-surface-lowest border border-outline-variant/10 p-12 relative overflow-hidden flex flex-col items-center">
            {/* Minimalist World Map Concept */}
            <div className="w-full max-w-4xl opacity-40 grayscale group hover:opacity-100 group-hover:grayscale-0 transition-all duration-1000">
               <img src="https://images.unsplash.com/photo-1521295121783-8a321d551ad2?q=80&w=2000&auto=format&fit=crop" alt="Global Operations Worldview" className="w-full h-80 object-cover grayscale opacity-20" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center font-headline text-xl italic text-on-surface/40 select-none">
              Maison de Luxe Architecture
            </div>
         </div>
      </section>
    </div>
  );
}
