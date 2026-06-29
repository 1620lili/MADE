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

  // Parsear imágenes y variantes desde JSON
  const imageUrlsRaw = formData.get('imageUrls') as string;
  const imageUrls: string[] = imageUrlsRaw ? JSON.parse(imageUrlsRaw) : [];
  const mainImageIndex = parseInt(formData.get('mainImageIndex') as string || '0');

  const variantsRaw = formData.get('variants') as string;
  const variants = variantsRaw ? JSON.parse(variantsRaw) : [];

  if (!name || variants.length === 0 || isNaN(companyId)) {
    return { error: 'El nombre y al menos una variante son obligatorios.' };
  }

  // Validar que cada variante tenga SKU y precio
  for (const v of variants) {
    if (!v.sku || !v.price) {
      return { error: 'Cada variante debe tener SKU y precio.' };
    }
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

    // PASO 2: Insertar todas las variantes
    for (const v of variants) {
      const { data: variant, error: variantError } = await adminSupabase
        .from('ProductVariant')
        .insert({
          productId: product.id,
          sku: v.sku,
          price: parseFloat(v.price),
          stock: parseInt(v.stock, 10) || 0,
          color: v.color || null,
          size: v.size || null,
          imageUrl: imageUrls[0] || null, // Usamos la primera imagen como default para la variante
        })
        .select()
        .single();

      if (variantError) throw variantError;

      // Registrar movimiento de inventario inicial si hay stock
      if (parseInt(v.stock, 10) > 0) {
        await adminSupabase.from('InventoryMovement').insert({
          variantId: variant.id,
          companyId,
          userId: session.userId,
          type: 'IN',
          quantity: parseInt(v.stock, 10),
        });
      }
    }

    // PASO 3: Insertar todas las imágenes
    for (let i = 0; i < imageUrls.length; i++) {
      await adminSupabase.from('ProductImage').insert({
        productId: product.id,
        url: imageUrls[i],
        isMain: i === mainImageIndex,
      });
    }

  } catch (err: any) {
    console.error("Error en createProduct:", err);
    if (err.code === '23505') {
      return { error: 'Un SKU ya está registrado. Debe ser único.' };
    }
    return { error: 'Error interno al registrar el producto.' };
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

export async function updateVariant(
  variantId: number, 
  data: { price?: number; stock?: number; color?: string; size?: string }
) {
  const session = await verifySession();
  if (!session) throw new Error('No autorizado');
  const adminSupabase = getServiceSupabase();
  const { error } = await adminSupabase
    .from('ProductVariant')
    .update(data)
    .eq('id', variantId);
  if (error) throw error;
  revalidatePath('/dashboard/inventario');
  revalidatePath('/admin/inventario');
}

export async function deleteVariant(variantId: number) {
  const session = await verifySession();
  if (!session) throw new Error('No autorizado');
  const adminSupabase = getServiceSupabase();
  const { error } = await adminSupabase
    .from('ProductVariant')
    .delete()
    .eq('id', variantId);
  if (error) throw error;
  revalidatePath('/dashboard/inventario');
  revalidatePath('/admin/inventario');
}

export async function createVariant(
  productId: number,
  data: { sku: string; price: number; stock: number; color?: string; size?: string }
) {
  const session = await verifySession();
  if (!session) throw new Error('No autorizado');
  const adminSupabase = getServiceSupabase();
  const { error } = await adminSupabase
    .from('ProductVariant')
    .insert({
      productId,
      ...data,
      imageUrl: null // Default null for new variants added via modal for now
    });
  if (error) throw error;
  revalidatePath('/dashboard/inventario');
  revalidatePath('/admin/inventario');
}

export async function updateProduct(
  productId: number,
  data: { name?: string; description?: string; brand?: string; isActive?: boolean }
) {
  const session = await verifySession();
  if (!session) throw new Error('No autorizado');
  const adminSupabase = getServiceSupabase();
  const { error } = await adminSupabase
    .from('Product')
    .update(data)
    .eq('id', productId);
  if (error) throw error;
  revalidatePath('/dashboard/inventario');
  revalidatePath('/admin/inventario');
}
