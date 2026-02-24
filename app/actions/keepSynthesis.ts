'use server'

import { stripe } from '@/lib/stripe'
import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function keepSynthesis(synthesisId: string) {
  const cookieStore = await cookies()

  // Auth client (respects session)
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
    redirect('/login')
  }

  // Service role client (secure verification)
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
    throw new Error('Synthesis not found')
  }

  if (synthesis.user_id !== user.id) {
    throw new Error('Unauthorized')
  }

  if (synthesis.paid) {
    redirect('/reflection/synthesis')
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

  redirect(session.url!)
}