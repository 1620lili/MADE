import { verifySession } from "@/features/auth/session";
import { getServiceSupabase } from "@/lib/supabase";
import { redirect, notFound } from "next/navigation";
import CreateProductForm from "@/components/inventory/CreateProductForm";

export const metadata = {
  title: "Nuevo Producto | LUXE ATELIER",
};

export default async function AdminNewProductPage({
  params,
}: {
  params: Promise<{ companyId: string }>;
}) {
  const session = await verifySession();
  const { companyId } = await params;

  if (!session || !session.isSuper) {
    redirect("/auth");
  }

  const adminSupabase = getServiceSupabase();
  
  // Verify company exists
  const { data: company } = await adminSupabase
    .from("Company")
    .select("name")
    .eq("id", companyId)
    .single();

  if (!company) {
    notFound();
  }

  return (
    <div className="space-y-12">
      <header className="border-b border-outline-variant/20 pb-10">
        <div className="flex items-center space-x-3 text-secondary mb-4">
          <span className="material-symbols-outlined text-sm">add_circle</span>
          <span className="font-label text-[10px] uppercase tracking-[0.4em]">Registro Maestro</span>
        </div>
        <h1 className="font-headline text-5xl lg:text-6xl tracking-tighter text-on-surface">Nueva Adquisición</h1>
        <p className="text-on-surface-variant font-body text-lg max-w-xl mt-4">
          Catalogando para <span className="text-on-surface font-bold italic">{company.name}</span>. 
          Asegúrate de que las especificaciones cumplen con los estándares de la boutique.
        </p>
      </header>

      <section className="bg-surface-lowest p-12 border border-outline-variant/10 shadow-sm">
        <CreateProductForm companyId={parseInt(companyId, 10)} isSuper={true} />
      </section>
    </div>
  );
}
