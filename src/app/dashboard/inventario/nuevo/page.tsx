import { verifySession } from "@/features/auth/session";
import { redirect } from "next/navigation";
import CreateProductForm from "@/components/inventory/CreateProductForm";

export const metadata = {
  title: "Añadir Pieza | LUXE ATELIER",
};

export default async function CompanyNewProductPage() {
  const session = await verifySession();

  if (!session || !session.companyId) {
    redirect("/auth");
  }

  return (
    <div className="space-y-12">
      <header className="border-b border-outline-variant/20 pb-10">
        <div className="flex items-center space-x-3 text-secondary mb-4">
          <span className="material-symbols-outlined text-sm">auto_awesome</span>
          <span className="font-label text-[10px] uppercase tracking-[0.4em]">Curaduría de Colección</span>
        </div>
        <h1 className="font-headline text-5xl lg:text-6xl tracking-tighter text-on-surface">Nueva Pieza Atelier</h1>
        <p className="text-on-surface-variant font-body text-lg max-w-xl mt-4">
          Registra una nueva obra en tu catálogo. Completa los detalles de la pieza y su variante inicial para comenzar.
        </p>
      </header>

      <section className="bg-surface-lowest p-12 border border-outline-variant/10 shadow-sm">
        <CreateProductForm companyId={parseInt(session.companyId, 10)} />
      </section>
    </div>
  );
}
