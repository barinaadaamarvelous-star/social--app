'use server'

import { getStripe } from '@/lib/stripe'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createStripeCheckout(synthesisId: string) {
  const cookieStore = await cookies()
  

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll() {},
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }
  const stripe = getStripe()
  
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],

    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Reflection Synthesis',
            description:
              'A calm, permanent synthesis of your reflections. One-time. No subscription.',
          },
          unit_amount: 1200, // $12
        },
        quantity: 1,
      },
    ],

    // 🔐 CRITICAL: metadata for webhook entitlement
    metadata: {
      synthesisId,
      userId: user.id,
    },

    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/reflection/synthesis?paid=1`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/reflection/synthesis?cancelled=1`,
  })

  return { url: session.url }

  // AFTER session creation
  await supabase
    .from('reflection_syntheses')
    .update({
      stripe_session_id: session.id,
      stripe_payment_intent_id: session.payment_intent,
  })
  .eq('id', synthesisId)
}
