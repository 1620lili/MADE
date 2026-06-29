import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { amount, email, orderId } = await req.json()
    
    const response = await fetch(
      'https://api.mercadopago.com/checkout/preferences',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.MP_ACCESS_TOKEN}`,
        },
        body: JSON.stringify({
          items: [{
            title: `Orden #${orderId}`,
            quantity: 1,
            unit_price: amount,
            currency_id: 'COP',
          }],
          payer: { email },
          back_urls: {
            success: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success`,
            failure: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/failure`,
          },
          auto_return: 'approved',
        }),
      }
    )
    const data = await response.json()
    return NextResponse.json({ 
      init_point: data.init_point,
      id: data.id 
    })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message }, { status: 500 }
    )
  }
}
