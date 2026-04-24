import { verifySession } from "@/features/auth/session";
import { getServiceSupabase } from "@/lib/supabase";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Ventas & Pagos | LUXE ATELIER",
};

export default async function AdminSalesPage() {
  const session = await verifySession();

  if (!session || !session.isSuper) {
    redirect("/auth");
  }

  const adminSupabase = getServiceSupabase();

  // Fetch recent orders across all companies
  const { data: orders, error } = await adminSupabase
    .from("Order")
    .select(`
      id,
      totalAmount,
      status,
      createdAt,
      Company (
        name
      )
    `)
    .order("createdAt", { ascending: false })
    .limit(50);

  if (error) {
    console.error("Sales Fetch Error:", error);
  }

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-outline-variant/20 pb-10">
        <div className="space-y-4">
           <div className="flex items-center space-x-3 text-secondary">
             <span className="material-symbols-outlined text-sm">payments</span>
             <span className="font-label text-[10px] uppercase tracking-[0.4em]">Flujo Financiero</span>
           </div>
           <h1 className="font-headline text-5xl lg:text-6xl tracking-tighter text-on-surface">Ventas y Pagos</h1>
           <p className="text-on-surface-variant font-body text-lg max-w-xl">
             Monitoreo transaccional global. Seguimiento de pedidos y estado de facturación de la red.
           </p>
        </div>
        
        <div className="flex bg-surface-lowest border border-outline-variant/30 p-2 rounded-sm space-x-4">
           <div className="text-right px-4">
              <p className="text-[8px] uppercase tracking-widest text-on-surface-variant">Ventas Hoy</p>
              <p className="font-headline text-xl">$12,450.00</p>
           </div>
           <div className="w-px bg-outline-variant/20"></div>
           <div className="text-right px-4">
              <p className="text-[8px] uppercase tracking-widest text-on-surface-variant">Pedidos</p>
              <p className="font-headline text-xl">42</p>
           </div>
        </div>
      </header>

      <section>
        <div className="overflow-x-auto bg-surface-lowest border border-outline-variant/10 rounded-sm shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-low/30 border-b border-outline-variant/20">
                <th className="px-8 py-6 font-label text-[0.625rem] uppercase tracking-[0.3em] text-on-surface-variant">Orden / Fecha</th>
                <th className="px-8 py-6 font-label text-[0.625rem] uppercase tracking-[0.3em] text-on-surface-variant">Boutique</th>
                <th className="px-8 py-6 font-label text-[0.625rem] uppercase tracking-[0.3em] text-on-surface-variant text-center">Monto</th>
                <th className="px-8 py-6 font-label text-[0.625rem] uppercase tracking-[0.3em] text-on-surface-variant text-center">Estado</th>
                <th className="px-8 py-6 font-label text-[0.625rem] uppercase tracking-[0.3em] text-on-surface-variant text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {orders?.map((order) => (
                <tr key={order.id} className="hover:bg-surface-low/30 transition-colors group">
                  <td className="px-8 py-7">
                     <div className="flex flex-col">
                        <span className="text-sm font-label font-bold text-on-surface">#{order.id.toString().substring(0, 8)}</span>
                        <span className="text-[10px] text-outline-variant tracking-wider">
                           {new Date(order.createdAt).toLocaleDateString("es-ES", { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                     </div>
                  </td>
                  <td className="px-8 py-7">
                     <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                        {(order.Company as any)?.name}
                     </span>
                  </td>
                  <td className="px-8 py-7 text-center">
                     <span className="text-sm font-label font-bold text-on-surface">
                        ${(order.totalAmount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                     </span>
                  </td>
                  <td className="px-8 py-7 text-center">
                     <span className={`text-[0.55rem] font-black uppercase tracking-[0.25em] px-3 py-1.5 rounded-sm ${order.status === 'COMPLETED' ? 'bg-secondary/10 text-secondary' : 'bg-surface-low text-on-surface-variant border border-outline-variant/10'}`}>
                        {order.status || 'PENDIENTE'}
                     </span>
                  </td>
                  <td className="px-8 py-7 text-right">
                     <button className="material-symbols-outlined text-outline-variant hover:text-secondary transition-colors">receipt</button>
                  </td>
                </tr>
              ))}
              {(!orders || orders.length === 0) && (
                <tr>
                  <td colSpan={5} className="px-8 py-24 text-center text-on-surface-variant font-body italic opacity-60 uppercase tracking-widest text-xs">
                     No se han registrado transacciones recientemente.
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
