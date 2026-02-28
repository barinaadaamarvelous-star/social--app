'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { getStripe } from '@/lib/stripe'
import { redirect } from 'next/navigation'

function getWeekStart(date = new Date()) {
  const d = new Date(date)
  const day = d.getDay() || 7
  if (day !== 1) d.setDate(d.getDate() - (day - 1))
  d.setHours(0, 0, 0, 0)
  return d.toISOString().slice(0, 10)
}

export async function saveReflection(formData: FormData) {
  console.log('🟢 saveReflection CALLED')

  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        },
      },
    }
  )

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    throw new Error('Not authenticated')
  }

  const body = String(formData.get('body') ?? '').trim()
  if (!body) {
    throw new Error('Reflection body is required')
  }

  const weekStart =
    String(formData.get('week_start')) || getWeekStart()

  const now = new Date().toISOString()

  const { error } = await supabase
    .from('creator_reflections')
    .insert({
      user_id: user.id,
      body,
      week_start: weekStart,
      locked_at: now,
      status: 'locked',
    })

  if (error) {
    if (error.code === '23505') {
      return { locked: true }
    }
    throw error
  }

  revalidatePath('/reflection')
  revalidatePath('/reflection/new')

  return { success: true }
}

/* ================================
   STRIPE — START CHECKOUT
================================ */

export async function startSynthesisCheckout() {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
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
    line_items: [
      {
        price: process.env.STRIPE_PRICE_ID!,
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/reflection/synthesis?paid=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/reflection`,
    metadata: {
      user_id: user.id,
    },
  })

  redirect(session.url!)
}
