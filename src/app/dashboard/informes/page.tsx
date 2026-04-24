import { verifySession } from "@/features/auth/session";
import { getServiceSupabase } from "@/lib/supabase";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Informes & Estadísticas | LUXE ATELIER",
};

export default async function CompanyReportsPage() {
  const session = await verifySession();

  if (!session || !session.companyId) {
    redirect("/auth");
  }

  const adminSupabase = getServiceSupabase();
  const { data: company } = await adminSupabase
    .from("Company")
    .select("name")
    .eq("id", session.companyId)
    .single();

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-outline-variant/20 pb-10">
        <div className="space-y-4">
           <div className="flex items-center space-x-3 text-secondary">
             <span className="material-symbols-outlined text-sm">bar_chart</span>
             <span className="font-label text-[10px] uppercase tracking-[0.4em]">Analítica Boutique</span>
           </div>
           <h1 className="font-headline text-5xl lg:text-6xl tracking-tighter text-on-surface">Informes de Rendimiento</h1>
           <p className="text-on-surface-variant font-body text-lg max-w-xl">
             Estadísticas detalladas de {company?.name || 'tu boutique'}. Análisis de ventas, popularidad de productos y tendencias de clientes.
           </p>
        </div>
        
        <button className="bg-on-surface text-surface px-8 py-4 text-[10px] tracking-widest uppercase font-label font-bold hover:bg-secondary transition-all">
          Descargar PDF Mensual
        </button>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="bg-surface-lowest border border-outline-variant/10 p-10 space-y-8">
           <h2 className="font-headline text-2xl tracking-tight">Rendimiento de Ventas</h2>
           <div className="aspect-[16/8] bg-surface-low/30 border border-outline-variant/5 flex items-center justify-center relative overflow-hidden group">
              <span className="material-symbols-outlined text-[100px] text-outline-variant opacity-10 group-hover:scale-110 transition-transform">monitoring</span>
              <div className="absolute inset-0 flex items-center justify-center font-label text-[10px] tracking-[0.4em] uppercase text-on-surface-variant/40">
                 Gráfico de Tendencias
              </div>
           </div>
           <div className="flex justify-between items-center border-t border-outline-variant/10 pt-6">
              <div>
                 <p className="text-[8px] uppercase tracking-widest text-on-surface-variant">Promedio Diario</p>
                 <p className="font-headline text-xl">$0.00</p>
              </div>
              <div className="text-right">
                 <p className="text-[8px] uppercase tracking-widest text-on-surface-variant">Conversión</p>
                 <p className="font-headline text-xl">12%</p>
              </div>
           </div>
        </div>

        <div className="bg-surface-lowest border border-outline-variant/10 p-10 space-y-8">
           <h2 className="font-headline text-2xl tracking-tight">Top Colecciones</h2>
           <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between">
                   <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-surface-low border border-outline-variant/10 rounded-full flex items-center justify-center text-[10px] font-bold">
                         #{i}
                      </div>
                      <span className="text-[10px] font-label uppercase tracking-widest">Línea de Diseñador {i}</span>
                   </div>
                   <span className="text-[10px] font-bold text-secondary">85% Popularidad</span>
                </div>
              ))}
           </div>
           <div className="pt-4 flex justify-center">
              <span className="text-[8px] font-label uppercase tracking-[0.3em] text-outline-variant italic">Análisis basado en los últimos 30 días</span>
           </div>
        </div>
      </section>
    </div>
  );
}
