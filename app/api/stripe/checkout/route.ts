import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const cookieStore = await cookies()
  const { synthesisId } = await req.json()

  if (!synthesisId) {
    return NextResponse.json(
      { error: 'Missing synthesisId' },
      { status: 400 }
    )
  }

  // Authenticated user (anon key)
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

  // Service role client for secure verification
  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: synthesis, error } = await admin
    .from('reflection_syntheses')
    .select('id, user_id, paid')
    .eq('id', synthesisId)
    .single()

  if (error || !synthesis) {
    return NextResponse.json(
      { error: 'Synthesis not found' },
      { status: 404 }
    )
  }

  if (synthesis.user_id !== user.id) {
    return NextResponse.json(
      { error: 'Forbidden' },
      { status: 403 }
    )
  }

  if (synthesis.paid) {
    return NextResponse.json(
      { error: 'Already unlocked' },
      { status: 400 }
    )
  }

  // Create Stripe Checkout session
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
      synthesisId: synthesis.id,
      userId: user.id,
    },
    success_url:
      `${process.env.NEXT_PUBLIC_SITE_URL}/reflection/synthesis?paid=true`,
    cancel_url:
      `${process.env.NEXT_PUBLIC_SITE_URL}/reflection/synthesis`,
  })

  return NextResponse.json({ url: session.url })
}