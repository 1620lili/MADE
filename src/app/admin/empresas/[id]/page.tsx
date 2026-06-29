import { verifySession } from '@/features/auth/session';
import { getServiceSupabase } from '@/lib/supabase';
import { redirect, notFound } from 'next/navigation';
import ManageCompanyClient from '@/components/company/ManageCompanyClient';

export const dynamic = 'force-dynamic'; // ensure fresh data

export default async function ManageCompanyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await verifySession();

  // 1. Verificar sesión
  if (!session) redirect('/auth');

  // 2. Verificar permisos
  const isSuper = session.isSuper;
  const isCompanyAdmin = session.role === 'COMPANY_ADMIN';
  if (!isSuper && !isCompanyAdmin) redirect('/auth');

  // 3. Si es COMPANY_ADMIN validar que sea su empresa
  if (isCompanyAdmin && !isSuper) {
    if (session.companyId?.toString() !== id) {
      redirect('/dashboard/inventario');
    }
  }

  const adminSupabase = getServiceSupabase();

  // 4. Cargar empresa
  const { data: company } = await adminSupabase
    .from('Company')
    .select('*')
    .eq('id', id)
    .single();

  if (!company) notFound();

  // 5. Cargar productos con variantes e imágenes
  const { data: products } = await adminSupabase
    .from('Product')
    .select(`
      id, name, description, brand, isActive, createdAt,
      ProductVariant(id, sku, price, stock, color, size, imageUrl),
      ProductImage(id, url, isMain)
    `)
    .eq('companyId', id)
    .order('createdAt', { ascending: false });

  // 6. Cargar usuarios de la empresa
  const { data: companyUsers } = await adminSupabase
    .from('User')
    .select('id, fullName, email, isActive, UserRole(Role(name))')
    .eq('companyId', id);

  return (
    <ManageCompanyClient
      company={company}
      products={products || []}
      companyUsers={companyUsers || []}
      session={session}
      isSuper={isSuper}
    />
  );
}
