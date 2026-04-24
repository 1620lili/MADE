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

  // Fetch Company Specific Stats
  const { data: company } = await adminSupabase
    .from("Company")
    .select("*")
    .eq("id", session.companyId)
    .single();

  const { count: productCount } = await adminSupabase
    .from("Product")
    .select("*", { count: 'exact', head: true })
    .eq("companyId", session.companyId);

  const { data: recentOrders } = await adminSupabase
    .from("Order")
    .select("*")
    .eq("companyId", session.companyId)
    .order("createdAt", { ascending: false })
    .limit(5);

  const { data: teamMembers } = await adminSupabase
    .from("User")
    .select("id")
    .eq("companyId", session.companyId);

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
             <span className="text-[10px] text-on-surface-variant font-bold tracking-widest">En Vivo</span>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-outline-variant font-bold mb-2">Ventas Netas</p>
            <h3 className="text-4xl font-headline tabular-nums">$0.00</h3>
          </div>
        </div>

        <div className="bg-surface-lowest p-8 border border-outline-variant/20 space-y-8 group hover:border-primary transition-all">
          <div className="flex justify-between items-start">
             <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>inventory_2</span>
             <span className="text-[10px] text-on-surface-variant font-bold tracking-widest">{productCount || 0} Artículos</span>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-outline-variant font-bold mb-2">Catálogo Activo</p>
            <h3 className="text-4xl font-headline tabular-nums">{productCount || 0}</h3>
          </div>
        </div>

        <div className="bg-surface-lowest p-8 border border-outline-variant/20 space-y-8 group hover:border-on-surface transition-all">
          <div className="flex justify-between items-start">
             <span className="material-symbols-outlined text-on-surface" style={{ fontVariationSettings: "'FILL' 1" }}>group</span>
             <span className="text-[10px] text-on-surface-variant font-bold tracking-widest">{teamMembers?.length || 0} Miembros</span>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-outline-variant font-bold mb-2">Equipo Atelier</p>
            <h3 className="text-4xl font-headline tabular-nums">{teamMembers?.length || 0}</h3>
          </div>
        </div>

        <div className="bg-surface-lowest p-8 border border-outline-variant/20 space-y-8 group hover:border-secondary transition-all">
          <div className="flex justify-between items-start">
             <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>local_shipping</span>
             <span className="text-[10px] text-on-surface-variant font-bold tracking-widest">Pendientes</span>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-outline-variant font-bold mb-2">Pedidos en Ruta</p>
            <h3 className="text-4xl font-headline tabular-nums">0</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
        {/* Recent Activity Section */}
        <section className="xl:col-span-2 space-y-8">
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
                     <p className="text-sm font-label font-bold">${order.totalAmount || '0.00'}</p>
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
        </section>

        {/* Quick Links / Actions */}
        <section className="space-y-8">
           <div className="flex items-center justify-between border-b border-outline-variant/20 pb-4">
              <h2 className="font-headline text-2xl tracking-tight">Accesos Directos</h2>
           </div>
           
           <div className="grid grid-cols-1 gap-4">
              <Link href="/dashboard/inventario" className="p-6 bg-surface-lowest border border-outline-variant/10 hover:border-secondary transition-all flex items-center justify-between group">
                 <div className="flex items-center space-x-4">
                    <span className="material-symbols-outlined text-secondary">add_circle</span>
                    <span className="text-[10px] font-label uppercase tracking-widest">Agregar Producto</span>
                 </div>
                 <span className="material-symbols-outlined text-sm opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
              </Link>
              <Link href="/dashboard/usuarios" className="p-6 bg-surface-lowest border border-outline-variant/10 hover:border-secondary transition-all flex items-center justify-between group">
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

