import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  try {
    const { amount, orderId, email } = await req.json()
    
    const amountInCents = Math.round(amount * 100)
    const reference = `ORDER-${orderId}-${Date.now()}`
    const currency = 'COP'
    
    // Generar firma de integridad Wompi
    const integrityString = 
      `${reference}${amountInCents}${currency}` +
      process.env.WOMPI_PRIVATE_KEY
    const signature = crypto
      .createHash('sha256')
      .update(integrityString)
      .digest('hex')
    
    return NextResponse.json({
      publicKey: process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY,
      currency,
      amountInCents,
      reference,
      signature,
      redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success`,
    })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message }, { status: 500 }
    )
  }
}
