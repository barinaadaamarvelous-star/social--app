// src/app/api/creator/reflection/emergency-unlock/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: Request) {
  const { reflectionId, reason } = await req.json()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!reason || reason.length < 10) {
    return NextResponse.json(
      { error: 'Reason required' },
      { status: 400 }
    )
  }

  await supabase
    .from('creator_reflections')
    .update({
      emergency_unlocked_at: new Date().toISOString(),
      emergency_unlock_reason: reason,
      locked_at: null,
    })
    .eq('id', reflectionId)
    .eq('creator_id', user.id)

  return NextResponse.json({ ok: true })
}
