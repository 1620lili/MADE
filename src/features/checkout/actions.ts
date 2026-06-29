'use server'

import { getServiceSupabase } from '@/lib/supabase'
import { verifySession } from '@/features/auth/session'
import { revalidatePath } from 'next/cache'

interface CreateOrderParams {
  formData: {
    fullName: string
    email: string
    phone: string
    address: string
    city: string
    country: string
    postalCode: string
  }
  items: any[]
  totalPrice: number
  tax: number
  total: number
  paymentMethod: string
  currency: string
}

export async function createOrder(params: CreateOrderParams) {
  const adminSupabase = getServiceSupabase()
  const { formData, items, total, currency, paymentMethod } = params

  try {
    // Agrupar items por companyId
    const companyId = items[0]?.companyId || null

    // 1. INSERT en Order
    const { data: order, error: orderError } = await adminSupabase
      .from('Order')
      .insert({
        companyId,
        status: 'PENDING',
        totalAmount: total,
        currency: currency || 'COP',
      })
      .select()
      .single()

    if (orderError) throw orderError

    // 2. INSERT en OrderCustomer
    const { error: customerError } = await adminSupabase
      .from('OrderCustomer')
      .insert({
        orderId: order.id,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
      })

    if (customerError) throw customerError

    // 3. INSERT en OrderAddress
    const { error: addressError } = await adminSupabase
      .from('OrderAddress')
      .insert({
        orderId: order.id,
        country: formData.country,
        city: formData.city,
        addressLine: formData.address,
        postalCode: formData.postalCode || null,
        phone: formData.phone,
      })

    if (addressError) throw addressError

    // 4. INSERT en OrderItem (uno por cada item del carrito)
    const orderItems = items.map(item => ({
      orderId: order.id,
      variantId: item.variantId,
      quantity: item.quantity,
      price: item.price,
    }))

    const { error: itemsError } = await adminSupabase
      .from('OrderItem')
      .insert(orderItems)

    if (itemsError) throw itemsError

    // 5. INSERT en Payment (pendiente hasta confirmar pasarela)
    const { data: paymentMethodData } = await adminSupabase
      .from('PaymentMethod')
      .select('id')
      .eq('name', paymentMethod === 'stripe' ? 'Stripe'
        : paymentMethod === 'mercadopago' ? 'MercadoPago'
        : paymentMethod === 'wompi' ? 'Wompi'
        : 'PayU')
      .single()

    const methodId = paymentMethodData?.id || null

    const { error: paymentError } = await adminSupabase
      .from('Payment')
      .insert({
        orderId: order.id,
        amount: total,
        methodId: methodId,
        status: 'PENDING',
        transactionId: null,
      })

    if (paymentError) throw paymentError

    revalidatePath('/dashboard/ventas')
    revalidatePath('/admin/ventas')

    return { success: true, orderId: order.id }
  } catch (err: any) {
    console.error('Error creating order:', err)
    return { error: err.message || 'Error al crear la orden' }
  }
}

export async function updatePaymentStatus(
  orderId: number,
  transactionId: string,
  status: 'COMPLETED' | 'FAILED' | 'PENDING'
) {
  const adminSupabase = getServiceSupabase()

  await adminSupabase
    .from('Payment')
    .update({
      status,
      transactionId,
      processedAt: new Date().toISOString(),
    })
    .eq('orderId', orderId)

  await adminSupabase
    .from('Order')
    .update({ status })
    .eq('id', orderId)

  revalidatePath('/dashboard/ventas')
  revalidatePath('/admin/ventas')
}
