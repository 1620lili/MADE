import { verifySession } from "@/features/auth/session";
import { getServiceSupabase } from "@/lib/supabase";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Ventas & Pagos | LUXE ATELIER",
};

export default async function CompanySalesPage() {
  const session = await verifySession();

  if (!session || !session.companyId) {
    redirect("/auth");
  }

  const adminSupabase = getServiceSupabase();

  // Fetch recent orders for this boutique
  const { data: orders, error } = await adminSupabase
    .from("Order")
    .select(`
      id,
      totalAmount,
      status,
      createdAt
    `)
    .eq("companyId", session.companyId)
    .order("createdAt", { ascending: false })
    .limit(50);

  if (error) {
    console.error("Company Sales Fetch Error:", error);
  }

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-outline-variant/20 pb-10">
        <div className="space-y-4">
           <div className="flex items-center space-x-3 text-secondary">
             <span className="material-symbols-outlined text-sm">payments</span>
             <span className="font-label text-[10px] uppercase tracking-[0.4em]">Gestión Financiera</span>
           </div>
           <h1 className="font-headline text-5xl lg:text-6xl tracking-tighter text-on-surface">Ventas y Pagos</h1>
           <p className="text-on-surface-variant font-body text-lg max-w-xl">
             Seguimiento de pedidos y estado de facturación de tu boutique. Controla tus ingresos y transacciones activas.
           </p>
        </div>
        
        <div className="flex bg-surface-lowest border border-outline-variant/30 p-4 rounded-sm items-center space-x-8">
           <div className="text-right">
              <p className="text-[8px] uppercase tracking-widest text-on-surface-variant">Ventas Totales</p>
              <p className="font-headline text-2xl">$0.00</p>
           </div>
           <button className="bg-on-surface text-surface px-6 py-3 text-[10px] tracking-widest uppercase font-label font-bold hover:bg-secondary transition-all">
             Exportar
           </button>
        </div>
      </header>

      <section>
        <div className="overflow-x-auto bg-surface-lowest border border-outline-variant/10 rounded-sm shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-low/30 border-b border-outline-variant/20">
                <th className="px-8 py-6 font-label text-[0.625rem] uppercase tracking-[0.3em] text-on-surface-variant">Referencia / Fecha</th>
                <th className="px-8 py-6 font-label text-[0.625rem] uppercase tracking-[0.3em] text-on-surface-variant text-center">Total del Pedido</th>
                <th className="px-8 py-6 font-label text-[0.625rem] uppercase tracking-[0.3em] text-on-surface-variant text-center">Estado de Entrega</th>
                <th className="px-8 py-6 font-label text-[0.625rem] uppercase tracking-[0.3em] text-on-surface-variant text-right">Detalles</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {orders?.map((order) => (
                <tr key={order.id} className="hover:bg-surface-low/30 transition-colors group">
                  <td className="px-8 py-7">
                     <div className="flex flex-col">
                        <span className="text-sm font-label font-bold text-on-surface">ORD-{order.id.toString().substring(0, 8).toUpperCase()}</span>
                        <span className="text-[10px] text-outline-variant tracking-wider">
                           {new Date(order.createdAt).toLocaleDateString("es-ES", { day: '2-digit', month: 'long', year: 'numeric' })}
                        </span>
                     </div>
                  </td>
                  <td className="px-8 py-7 text-center">
                     <span className="text-sm font-label font-bold text-on-surface">
                        ${(order.totalAmount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                     </span>
                  </td>
                  <td className="px-8 py-7 text-center">
                     <span className={`text-[0.55rem] font-black uppercase tracking-[0.25em] px-3 py-1.5 rounded-sm ${order.status === 'COMPLETED' ? 'bg-secondary/10 text-secondary' : 'bg-surface-low text-on-surface-variant border border-outline-variant/10'}`}>
                        {order.status || 'PROCESANDO'}
                     </span>
                  </td>
                  <td className="px-8 py-7 text-right">
                     <button className="material-symbols-outlined text-outline-variant hover:text-secondary transition-colors">visibility</button>
                  </td>
                </tr>
              ))}
              {(!orders || orders.length === 0) && (
                <tr>
                  <td colSpan={4} className="px-8 py-24 text-center text-on-surface-variant font-body italic opacity-60 uppercase tracking-widest text-xs">
                     No hay pedidos registrados recientemente en tu boutique.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
