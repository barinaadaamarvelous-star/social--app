import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import type Stripe from 'stripe'
import { stripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  const body = await req.text()
  const signature = (await headers()).get('stripe-signature')

  if (!signature) {
    return new NextResponse('Missing Stripe signature', { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('❌ Webhook verification failed:', err)
    return new NextResponse('Webhook verification failed', { status: 400 })
  }

  // ─────────────────────────────────────────────
// PAYMENT SUCCESS → GRANT ENTITLEMENT
// ─────────────────────────────────────────────
if (event.type === 'checkout.session.completed') {
  const session = event.data.object as Stripe.Checkout.Session

  const synthesisId = session.metadata?.synthesisId
  const userId = session.metadata?.userId

  if (!synthesisId || !userId) {
    console.error('❌ Missing metadata on checkout session')
    return new NextResponse('Invalid session metadata', { status: 400 })
  }

  const { error } = await supabase
    .from('reflection_syntheses')
    .update({
      paid: true,
      paid_at: new Date().toISOString(),
      refunded: false,
      refunded_at: null,
      stripe_session_id: session.id,
      stripe_payment_intent_id:
        typeof session.payment_intent === 'string'
          ? session.payment_intent
          : session.payment_intent?.id ?? null,
    })
    .eq('id', synthesisId)
    .eq('user_id', userId)

  if (error) {
    console.error('❌ Failed to grant entitlement:', error)
    return new NextResponse('Database update failed', { status: 500 })
  }
}


  // ─────────────────────────────────────────────
  // REFUND → REVOKE ENTITLEMENT (CALM EXIT)
  // ─────────────────────────────────────────────
  if (event.type === 'charge.refunded') {
    const charge = event.data.object as Stripe.Charge
    const paymentIntentId = charge.payment_intent as string | null

    if (!paymentIntentId) {
      console.warn('⚠️ Refund without payment_intent')
      return NextResponse.json({ received: true })
    }

    // Find synthesis via Stripe session
    const { data: synthesis, error: lookupError } = await supabase
      .from('reflection_syntheses')
      .select('id')
      .eq('stripe_payment_intent_id', paymentIntentId)
      .maybeSingle()

    if (lookupError) {
      console.error('❌ Failed to lookup synthesis for refund:', lookupError)
      return new NextResponse('Lookup failed', { status: 500 })
    }

    if (!synthesis) {
      // Idempotent: already revoked or never existed
      return NextResponse.json({ received: true })
    }

    const { error: revokeError } = await supabase
      .from('reflection_syntheses')
      .update({
        paid: false,
        refunded: true,
        refunded_at: new Date().toISOString(),
      })
      .eq('id', synthesis.id)

    if (revokeError) {
      console.error('❌ Failed to revoke entitlement:', revokeError)
      return new NextResponse('Revoke failed', { status: 500 })
    }
  }

  return NextResponse.json({ received: true })
}
