'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

export async function autoGenerateSynthesis() {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return

  // ── check last synthesis ─────────────────────
  const { data: last } = await supabase
    .from('reflection_syntheses')
    .select('period_end')
    .eq('user_id', user.id)
    .order('period_end', { ascending: false })
    .limit(1)
    .maybeSingle()

  const periodStart = last?.period_end ?? null
  const now = new Date()

  // Require at least 14 days since last synthesis
  if (periodStart) {
    const diff =
      now.getTime() - new Date(periodStart).getTime()

    const days = diff / (1000 * 60 * 60 * 24)
    if (days < 14) return
  }

  // ── fetch reflections since last synthesis ───
  let query = supabase
    .from('creator_reflections')
    .select('body, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true })

  if (periodStart) {
    query = query.gt('created_at', periodStart)
  }

  const { data: reflections } = await query

  if (!reflections || reflections.length < 3) return

  // ── temporary synthesis logic ────────────────
  const content = {
    title: 'A held period',
    summary:
      'This period carried thought, repetition, and quiet processing.',
    themes: ['processing', 'holding', 'release'],
    notable_lines: reflections
      .slice(0, 4)
      .map((r) => r.body.slice(0, 140)),
  }

  await supabase.from('reflection_syntheses').insert({
    user_id: user.id,
    period_start:
      reflections[0].created_at,
    period_end:
      reflections[reflections.length - 1].created_at,
    content,
    paid: false,
  })

  revalidatePath('/reflection/synthesis')
}
