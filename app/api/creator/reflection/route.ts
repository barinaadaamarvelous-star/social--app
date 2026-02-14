// src/app/api/creator/reflection/current/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET() {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ reflection: null })
  }

  // start of current week (UTC, simple version)
  const weekStart = new Date()
  weekStart.setUTCHours(0, 0, 0, 0)
  weekStart.setUTCDate(weekStart.getUTCDate() - weekStart.getUTCDay())

  const { data } = await supabase
    .from('creator_reflections')
    .select('id, body, status, locked_at')
    .eq('creator_id', user.id)
    .eq('week_start', weekStart.toISOString().slice(0, 10))
    .maybeSingle()

  return NextResponse.json({
    reflection: data ?? null,
  })
}
