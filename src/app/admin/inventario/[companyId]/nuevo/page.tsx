import { getServiceSupabase } from "@/lib/supabase";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import CreateProductForm from "@/components/inventory/CreateProductForm";

interface Props {
  params: Promise<{ companyId: string }>;
}

export default async function NewProductPage({ params }: Props) {
  const { companyId } = await params;
  const adminSupabase = getServiceSupabase();

  const { data: company } = await adminSupabase
    .from('Company')
    .select('id, name')
    .eq('id', companyId)
    .single();

  if (!company) {
    redirect('/admin/inventario');
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header and Breadcrumbs */}
      <div className="mb-8">
        <Link 
          href={`/admin/inventario?companyId=${companyId}`}
          className="inline-flex items-center gap-2 text-[10px] font-label uppercase tracking-widest text-on-surface-variant hover:text-secondary transition-colors mb-6"
        >
          <span className="material-symbols-outlined" style={{fontSize: '16px'}}>arrow_back</span>
          Volver al Inventario
        </Link>
        <div className="flex items-center gap-2 text-[10px] font-label uppercase tracking-[0.2em] text-on-surface-variant mb-2">
          <span>Inventario</span>
          <span className="material-symbols-outlined" style={{fontSize: '12px'}}>chevron_right</span>
          <span>{company.name}</span>
          <span className="material-symbols-outlined" style={{fontSize: '12px'}}>chevron_right</span>
          <span className="text-secondary font-bold">Nuevo Producto</span>
        </div>
        <h1 className="font-headline text-3xl text-on-surface tracking-tight">Crear Nuevo Producto</h1>
      </div>

      {/* Form Component */}
      <CreateProductForm companyId={parseInt(companyId, 10)} />
    </div>
  );
}
