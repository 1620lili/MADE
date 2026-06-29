import { verifySession } from "@/features/auth/session";
import { getServiceSupabase } from "@/lib/supabase";
import { notFound, redirect } from "next/navigation";
import CreateProductForm from "@/components/inventory/CreateProductForm";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const session = await verifySession();
  if (!session) redirect("/auth");

  const { id } = await params;
  const productId = parseInt(id, 10);
  if (isNaN(productId)) notFound();

  const adminSupabase = getServiceSupabase();

  // Fetch product with variants and images
  const { data: product } = await adminSupabase
    .from("Product")
    .select(`
      *,
      ProductVariant(*),
      ProductImage(*)
    `)
    .eq("id", productId)
    .single();

  if (!product) notFound();

  // Permisos: Un Admin de Empresa solo puede editar sus propios productos
  if (!session.isSuper && session.companyId !== product.companyId.toString()) {
    redirect("/dashboard/inventario");
  }

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <div className="flex items-center space-x-3 text-secondary">
          <span className="material-symbols-outlined text-sm">edit_square</span>
          <span className="font-label text-[10px] uppercase tracking-[0.4em]">Editor de Pieza</span>
        </div>
        <h1 className="font-headline text-4xl tracking-tight text-on-surface">Editar Producto</h1>
      </header>

      <div className="max-w-4xl">
        <CreateProductForm 
          companyId={product.companyId} 
          mode="edit" 
          initialData={product} 
        />
      </div>
    </div>
  );
}
