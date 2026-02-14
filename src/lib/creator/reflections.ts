/**
 * ─────────────────────────────────────────────────────────────
 * REFLECTION DATA — TRUST BOUNDARY (DO NOT WEAKEN)
 * ─────────────────────────────────────────────────────────────
 *
 * This file operates inside a hard privacy contract.
 *
 * NON-NEGOTIABLE GUARANTEES:
 * - Reflections are readable ONLY by their creator.
 * - No cross-user access, aggregation, or comparison — ever.
 * - Echo queries are NOT special cases; they inherit the same RLS.
 * - Absence (null data) is a valid and expected state.
 *
 * DO NOT:
 * - Add admin bypasses.
 * - Add service-role access here.
 * - Add analytics, counts, trends, or optimizations.
 * - Surface echo data automatically or eagerly.
 *
 * If any of these rules feel inconvenient,
 * the correct response is to REMOVE the feature — not weaken the rules.
 *
 * If this contract breaks, the product is no longer itself.
 */

import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import type { CreatorReflection } from './types'

/**
 * Returns the current creator's reflection for the current week.
 * If none exists, creates an empty slot (status = 'empty').
 */
export async function getReflectionForWeek(): Promise<CreatorReflection | null> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Cookie: cookies().toString(),
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  // ── week start (Monday, UTC)
  const now = new Date()
  const day = now.getUTCDay() || 7
  const monday = new Date(now)
  monday.setUTCDate(now.getUTCDate() - day + 1)
  monday.setUTCHours(0, 0, 0, 0)

  const weekStart = monday.toISOString().slice(0, 10)

  // ── try fetch existing reflection
  const { data: existing } = await supabase
    .from('creator_reflections')
    .select('*')
    .eq('creator_id', user.id)
    .eq('week_start', weekStart)
    .maybeSingle<CreatorReflection>()

  if (existing) return existing

  // ── create empty slot (no guilt, no forcing)
  const { data: created } = await supabase
    .from('creator_reflections')
    .insert({
      creator_id: user.id,
      week_start: weekStart,
      body: null,
      status: 'empty',
    })
    .select()
    .single<CreatorReflection>()

  return created ?? null
}

/**
 * Quietly fetches ONE reflection from 3–6 months ago
 * for self-compare echo. Never required, never surfaced
 * automatically, never aggregated.
 */
/**
 * Quiet self-compare echo (3–6 months old).
 *
 * DESIGN CONSTRAINTS (INTENTIONAL LIMITATIONS):
 * - Returns at most ONE reflection.
 * - Never recent. Never optimized. Never motivating.
 * - Used only in the context of active reflection.
 * - Must remain hidden by default in UI.
 *
 * This function exists to support recognition, not performance.
 * If you are tempted to expand this, stop.
 */

export async function getReflectionEcho(): Promise<{
  week_start: string
  body: string
} | null> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Cookie: cookies().toString(),
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  // ── 3–6 month window
  const from = new Date()
  from.setUTCMonth(from.getUTCMonth() - 6)

  const to = new Date()
  to.setUTCMonth(to.getUTCMonth() - 3)

  const { data } = await supabase
    .from('creator_reflections')
    .select('week_start, body')
    .eq('creator_id', user.id)
    .eq('status', 'written')
    .gte('week_start', from.toISOString().slice(0, 10))
    .lte('week_start', to.toISOString().slice(0, 10))
    .order('week_start', { ascending: false })
    .limit(1)
    .maybeSingle<{ week_start: string; body: string }>()

  return data ?? null
}
