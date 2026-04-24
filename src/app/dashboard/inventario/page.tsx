import { verifySession } from "@/features/auth/session";
import { getServiceSupabase } from "@/lib/supabase";
import { redirect } from "next/navigation";
import Link from "next/link";
import InventoryTable from "@/components/inventory/InventoryTable";

export const metadata = {
  title: "Inventario Boutique | LUXE ATELIER",
};

export default async function CompanyInventoryPage() {
  const session = await verifySession();

  if (!session || !session.companyId) {
    redirect("/auth");
  }

  const adminSupabase = getServiceSupabase();

  // Fetch products specific to this boutique with relations
  const { data: products, error } = await adminSupabase
    .from("Product")
    .select(`
      id,
      name,
      brand,
      isActive,
      createdAt,
      ProductVariant (
        price,
        stock
      ),
      ProductImage (
        url,
        isMain
      )
    `)
    .eq("companyId", session.companyId)
    .order("createdAt", { ascending: false });

  if (error) {
    console.error("Company Inventory Fetch Error:", error);
  }

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-outline-variant/20 pb-10">
        <div className="space-y-4">
           <div className="flex items-center space-x-3 text-secondary">
             <span className="material-symbols-outlined text-sm">inventory_2</span>
             <span className="font-label text-[10px] uppercase tracking-[0.4em]">Gestión de Stock</span>
           </div>
           <h1 className="font-headline text-5xl lg:text-6xl tracking-tighter text-on-surface">Maison Inventory</h1>
           <p className="text-on-surface-variant font-body text-lg max-w-xl">
             Control de existencias de tu boutique. Gestiona tus colecciones y disponibilidad en tiempo real.
           </p>
        </div>
        
        <Link 
          href="/dashboard/inventario/nuevo" 
          className="bg-on-surface text-surface px-8 py-4 text-[10px] tracking-widest uppercase font-label font-bold hover:bg-secondary transition-all shadow-lg hover:shadow-secondary/20 flex items-center space-x-3"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          <span>Añadir Nueva Pieza</span>
        </Link>
      </header>

      <section>
        <InventoryTable products={(products as any) || []} />
      </section>
    </div>
  );
}
  );
}
