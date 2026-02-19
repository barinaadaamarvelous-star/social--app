// app/api/creator/reflection/route.ts

import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const { createClient } = await import('@supabase/supabase-js')

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
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { body } = await req.json()

  if (!body) {
    return NextResponse.json(
      { error: 'Reflection body is required' },
      { status: 400 }
    )
  }

  const weekStart = new Date()
  weekStart.setUTCHours(0, 0, 0, 0)
  weekStart.setUTCDate(weekStart.getUTCDate() - weekStart.getUTCDay())

  const { data, error } = await supabase
    .from('creator_reflections')
    .upsert({
      creator_id: user.id,
      body,
      week_start: weekStart.toISOString().slice(0, 10),
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ reflection: data })
}
