import { verifySession } from "@/features/auth/session";
import { getServiceSupabase } from "@/lib/supabase";
import { redirect } from "next/navigation";
import Link from "next/link";
import InventoryTable from "@/components/inventory/InventoryTable";

export const metadata = {
  title: "Inventario Global | LUXE ATELIER",
};

export default async function GlobalInventoryPage({
  searchParams,
}: {
  searchParams: Promise<{ companyId?: string }>;
}) {
  const session = await verifySession();
  const { companyId } = await searchParams;

  if (!session || !session.isSuper) {
    redirect("/auth");
  }

  const adminSupabase = getServiceSupabase();

  // Fetch Companies for the selector
  const { data: companies } = await adminSupabase
    .from("Company")
    .select("id, name")
    .eq("isActive", true)
    .order("name");

  // Fetch products with variants and images
  let query = adminSupabase
    .from("Product")
    .select(`
      id,
      name,
      brand,
      isActive,
      createdAt,
      Company (
        name
      ),
      ProductVariant (
        price,
        stock
      ),
      ProductImage (
        url,
        isMain
      )
    `)
    .order("createdAt", { ascending: false });

  if (companyId) {
    query = query.eq("companyId", companyId);
  }

  const { data: products, error } = await query;

  if (error) {
    console.error("Inventory Fetch Error:", error);
  }

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-10 border-b border-outline-variant/20 pb-10">
        <div className="space-y-4">
           <div className="flex items-center space-x-3 text-secondary">
             <span className="material-symbols-outlined text-sm">inventory_2</span>
             <span className="font-label text-[10px] uppercase tracking-[0.4em]">Control de Red</span>
           </div>
           <h1 className="font-headline text-5xl lg:text-6xl tracking-tighter text-on-surface">Inventario Maestro</h1>
           <p className="text-on-surface-variant font-body text-lg max-w-xl">
             Gestión centralizada de stock. Monitoreo unificado de colecciones a través de todas las boutiques.
           </p>
        </div>

        <div className="flex flex-col space-y-6 lg:items-end">
           {/* Botón Agregar - Requiere empresa seleccionada */}
           {companyId ? (
              <Link 
                href={`/admin/inventario/${companyId}/nuevo`}
                className="bg-on-surface text-surface px-8 py-4 text-[10px] tracking-widest uppercase font-label font-bold hover:bg-secondary transition-all shadow-lg hover:shadow-secondary/20 flex items-center space-x-3"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                <span>Agregar Producto</span>
              </Link>
           ) : (
              <div className="group relative">
                <button className="bg-surface-container-high text-on-surface-variant/40 px-8 py-4 text-[10px] tracking-widest uppercase font-label font-bold cursor-not-allowed border border-outline-variant/10 flex items-center space-x-3">
                   <span className="material-symbols-outlined text-sm">lock</span>
                   <span>Agregar Producto</span>
                </button>
                <div className="absolute bottom-full right-0 mb-2 w-48 bg-on-surface text-surface text-[8px] uppercase tracking-widest p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                   Selecciona una boutique primero para registrar productos.
                </div>
              </div>
           )}

           {/* Selector de Boutique */}
           <div className="flex flex-col space-y-2">
              <span className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant ml-1">Filtrar por Boutique</span>
              <div className="flex bg-surface-lowest border border-outline-variant/30 p-1 rounded-sm">
                <Link 
                  href="/admin/inventario" 
                  className={`px-6 py-3 text-[10px] font-label uppercase tracking-widest transition-all ${!companyId ? 'bg-on-surface text-surface shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
                >
                  Todas
                </Link>
                {companies?.map((c) => (
                  <Link 
                    key={c.id}
                    href={`/admin/inventario?companyId=${c.id}`}
                    className={`px-6 py-3 text-[10px] font-label uppercase tracking-widest transition-all ${companyId === c.id.toString() ? 'bg-on-surface text-surface shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
           </div>
        </div>
      </header>

      <section>
        <InventoryTable products={(products as any) || []} showCompany={!companyId} />
      </section>
    </div>
  );
}
