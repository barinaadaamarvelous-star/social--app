// app/api/creator/reflection/current/route.ts

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json(
      { error: 'Missing Supabase environment variables' },
      { status: 500 }
    )
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ reflection: null })
  }

  // Start of current week (UTC)
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
