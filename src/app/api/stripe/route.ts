import { NextRequest, NextResponse } from 'next/server'
import { createStripePaymentIntent } from '@/lib/payments/stripe'

export async function POST(req: NextRequest) {
  try {
    const { amount } = await req.json()
    const paymentIntent = await createStripePaymentIntent(amount)
    return NextResponse.json({
      clientSecret: paymentIntent.client_secret
    })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message }, { status: 500 }
    )
  }
}
