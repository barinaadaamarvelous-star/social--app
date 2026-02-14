import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function POST() {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {},
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          unit_amount: 1200,
          product_data: {
            name: 'Hold this synthesis',
            description:
              'A private synthesis of a period of reflection. No subscription. No reminders.',
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      user_id: user.id,
    },
    success_url:
      `${process.env.NEXT_PUBLIC_SITE_URL}/reflection/synthesis?paid=true`,
    cancel_url:
      `${process.env.NEXT_PUBLIC_SITE_URL}/reflection/synthesis`,
  })

  return NextResponse.json({ url: session.url })
}
