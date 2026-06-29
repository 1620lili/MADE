import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  try {
    const { amount, orderId, email, fullName } = await req.json()
    
    const referenceCode = `ORDER-${orderId}-${Date.now()}`
    const currency = 'COP'
    
    // Generar firma PayU
    const signatureString = 
      `${process.env.PAYU_API_KEY}~` +
      `${process.env.NEXT_PUBLIC_PAYU_MERCHANT_ID}~` +
      `${referenceCode}~${amount}~${currency}`
    const signature = crypto
      .createHash('md5')
      .update(signatureString)
      .digest('hex')
    
    return NextResponse.json({
      merchantId: process.env.NEXT_PUBLIC_PAYU_MERCHANT_ID,
      accountId: process.env.NEXT_PUBLIC_PAYU_ACCOUNT_ID,
      referenceCode,
      amount,
      currency,
      signature,
      test: 1, // Modo prueba
      buyerEmail: email,
      buyerFullName: fullName,
      responseUrl: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success`,
      confirmationUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/payu/confirm`,
    })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message }, { status: 500 }
    )
  }
}
