import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

export async function getReflectionEcho(
  creatorId: string,
  currentWeekStart: string
) {
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

  // 3–6 months back window
  const from = new Date(currentWeekStart)
  from.setMonth(from.getMonth() - 6)

  const to = new Date(currentWeekStart)
  to.setMonth(to.getMonth() - 3)

  const { data } = await supabase
    .from('creator_reflections')
    .select('body, week_start')
    .eq('creator_id', creatorId)
    .eq('status', 'written')
    .gte('week_start', from.toISOString().slice(0, 10))
    .lte('week_start', to.toISOString().slice(0, 10))
    .order('week_start', { ascending: false })
    .limit(1)

  return data?.[0] ?? null
}
