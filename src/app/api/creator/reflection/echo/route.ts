import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET() {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json(null)
  }

  // fetch a reflection from ~8–12 weeks ago
  const { data } = await supabase
    .from('creator_reflections')
    .select('body, week_start')
    .eq('creator_id', user.id)
    .eq('status', 'written')
    .lt(
      'week_start',
      new Date(Date.now() - 8 * 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10)
    )
    .order('week_start', { ascending: false })
    .limit(1)
    .maybeSingle()

  return NextResponse.json(data)
}
