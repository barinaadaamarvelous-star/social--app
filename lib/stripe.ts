import Stripe from 'stripe'

export const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY!,
  {
    // IMPORTANT: must match SDK-pinned version
    apiVersion: '2026-01-28.clover',
  }
)
