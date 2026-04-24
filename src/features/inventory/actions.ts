'use server';

import { getServiceSupabase } from '@/lib/supabase';
import { verifySession } from '@/features/auth/session';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function createProduct(prevState: any, formData: FormData) {
  const session = await verifySession();
  if (!session) return { error: 'No se pudo verificar la sesión.' };

  const adminSupabase = getServiceSupabase();

  // 1. Validar inputs básicos
  const companyIdStr = formData.get('companyId') as string;
  const companyId = parseInt(companyIdStr, 10);
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const brand = formData.get('brand') as string;
  const isActive = formData.get('isActive') === 'on';

  // Datos de la variante
  const sku = formData.get('sku') as string;
  const priceStr = formData.get('price') as string;
  const price = parseFloat(priceStr);
  const stockStr = formData.get('stock') as string;
  const stock = parseInt(stockStr, 10) || 0;
  const color = formData.get('color') as string;
  const size = formData.get('size') as string;
  const imageUrl = formData.get('imageUrl') as string;

  if (!name || !sku || isNaN(price) || isNaN(companyId)) {
    return { error: 'El nombre, SKU y precio son campos obligatorios.' };
  }

  // Protección extra: Un Admin de Empresa solo puede crear productos para su propia empresa
  if (!session.isSuper && session.companyId !== companyId.toString()) {
    return { error: 'No tienes permiso para registrar productos en esta boutique.' };
  }

  try {
    // PASO 1: Insertar Producto
    const { data: product, error: productError } = await adminSupabase
      .from('Product')
      .insert({
        name,
        description,
        brand,
        companyId,
        isActive,
      })
      .select()
      .single();

    if (productError) throw productError;

    // PASO 2: Insertar Variante
    const { data: variant, error: variantError } = await adminSupabase
      .from('ProductVariant')
      .insert({
        productId: product.id,
        sku,
        price,
        color,
        size,
        stock,
        imageUrl: imageUrl || null,
      })
      .select()
      .single();

    if (variantError) throw variantError;

    // PASO 3: Insertar Imagen si existe
    if (imageUrl) {
      const { error: imageError } = await adminSupabase
        .from('ProductImage')
        .insert({
          productId: product.id,
          url: imageUrl,
          isMain: true,
        });
      
      if (imageError) console.error("Error al registrar imagen:", imageError);
    }

    // PASO 4: Registrar movimiento de inventario inicial si hay stock
    if (stock > 0) {
      const { error: movementError } = await adminSupabase
        .from('InventoryMovement')
        .insert({
          variantId: variant.id,
          companyId,
          userId: session.userId, // Usamos el UUID del usuario autenticado
          type: 'IN',
          quantity: stock,
        });
      
      if (movementError) console.error("Error al registrar movimiento:", movementError);
    }

  } catch (err: any) {
    console.error("Error en createProduct:", err);
    if (err.code === '23505') {
      return { error: 'Este SKU ya está registrado en el sistema. Debe ser único.' };
    }
    return { error: 'Ocurrió un error interno al intentar catalogar la pieza.' };
  }

  // Revalidar y redireccionar
  const redirectPath = session.isSuper ? `/admin/inventario` : `/dashboard/inventario`;
  revalidatePath(redirectPath);
  redirect(redirectPath);
}

export async function toggleProductStatus(productId: number, currentStatus: boolean) {
  const session = await verifySession();
  if (!session) throw new Error('No autorizado');

  const adminSupabase = getServiceSupabase();
  
  const { error } = await adminSupabase
    .from('Product')
    .update({ isActive: !currentStatus })
    .eq('id', productId);

  if (error) throw error;
  
  revalidatePath(session.isSuper ? '/admin/inventario' : '/dashboard/inventario');
}
