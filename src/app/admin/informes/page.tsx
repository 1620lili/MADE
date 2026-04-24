import { verifySession } from "@/features/auth/session";
import { getServiceSupabase } from "@/lib/supabase";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Informes & Estadísticas | LUXE ATELIER",
};

export default async function AdminReportsPage() {
  const session = await verifySession();

  if (!session || !session.isSuper) {
    redirect("/auth");
  }

  // In a real app, we would perform complex aggregations here.
  // For now, we show a premium placeholder with real basic stats.
  const adminSupabase = getServiceSupabase();
  const { count: companyCount } = await adminSupabase.from("Company").select("*", { count: 'exact', head: true });
  const { count: userCount } = await adminSupabase.from("User").select("*", { count: 'exact', head: true });

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-outline-variant/20 pb-10">
        <div className="space-y-4">
           <div className="flex items-center space-x-3 text-secondary">
             <span className="material-symbols-outlined text-sm">bar_chart</span>
             <span className="font-label text-[10px] uppercase tracking-[0.4em]">Inteligencia de Negocios</span>
           </div>
           <h1 className="font-headline text-5xl lg:text-6xl tracking-tighter text-on-surface">Informes Globales</h1>
           <p className="text-on-surface-variant font-body text-lg max-w-xl">
             Análisis de rendimiento de la red. Estadísticas consolidadas y métricas de crecimiento boutique.
           </p>
        </div>
        
        <button className="bg-on-surface text-surface px-8 py-4 text-[10px] tracking-widest uppercase font-label font-bold hover:bg-secondary transition-all">
          Exportar Data Histórica
        </button>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="bg-surface-lowest border border-outline-variant/10 p-10 space-y-8">
           <h2 className="font-headline text-2xl tracking-tight">Crecimiento de la Red</h2>
           <div className="aspect-[16/6] bg-surface-low/30 border border-outline-variant/5 flex items-center justify-center relative overflow-hidden group">
              <span className="material-symbols-outlined text-[100px] text-outline-variant opacity-10 group-hover:scale-110 transition-transform">timeline</span>
              <div className="absolute inset-0 flex items-center justify-center font-label text-[10px] tracking-[0.4em] uppercase text-on-surface-variant/40">
                 Visualización de Reporte Mensual
              </div>
           </div>
           <div className="grid grid-cols-3 gap-6">
              <div className="space-y-1">
                 <p className="text-[8px] uppercase tracking-widest text-on-surface-variant">Boutiques</p>
                 <p className="font-headline text-3xl">{companyCount || 0}</p>
              </div>
              <div className="space-y-1">
                 <p className="text-[8px] uppercase tracking-widest text-on-surface-variant">Usuarios</p>
                 <p className="font-headline text-3xl">{userCount || 0}</p>
              </div>
              <div className="space-y-1">
                 <p className="text-[8px] uppercase tracking-widest text-on-surface-variant">Retención</p>
                 <p className="font-headline text-3xl">98%</p>
              </div>
           </div>
        </div>

        <div className="bg-surface-lowest border border-outline-variant/10 p-10 space-y-8">
           <h2 className="font-headline text-2xl tracking-tight">Distribución de Mercado</h2>
           <div className="aspect-[16/6] bg-surface-low/30 border border-outline-variant/5 flex items-center justify-center relative overflow-hidden group">
              <span className="material-symbols-outlined text-[100px] text-outline-variant opacity-10 group-hover:scale-110 transition-transform">pie_chart</span>
              <div className="absolute inset-0 flex items-center justify-center font-label text-[10px] tracking-[0.4em] uppercase text-on-surface-variant/40">
                 Market Share por Región
              </div>
           </div>
           <div className="space-y-4">
              <div className="flex justify-between items-center">
                 <span className="text-[10px] font-label uppercase tracking-widest">Europa</span>
                 <div className="flex-1 mx-4 h-1 bg-surface-low overflow-hidden">
                    <div className="h-full bg-secondary w-2/3"></div>
                 </div>
                 <span className="text-[10px] font-bold">65%</span>
              </div>
              <div className="flex justify-between items-center">
                 <span className="text-[10px] font-label uppercase tracking-widest">América</span>
                 <div className="flex-1 mx-4 h-1 bg-surface-low overflow-hidden">
                    <div className="h-full bg-on-surface w-1/4"></div>
                 </div>
                 <span className="text-[10px] font-bold">25%</span>
              </div>
           </div>
        </div>
      </section>
    </div>
  );
}
