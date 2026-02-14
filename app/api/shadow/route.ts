import { createClient } from '@supabase/supabase-js'
import type { ShadowEvent } from '@/lib/shadowTypes'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  const body = await req.json()

  const {
    postId,
    eventType,
    sessionHash,
  }: {
    postId: string
    eventType: ShadowEvent
    sessionHash: string
  } = body

  // optional hard safety
  const allowed: ShadowEvent[] = [
    'view_start',
    'view_end',
    'rewatch',
    'like',
    'save',
    'hover_long',
  ]

  if (!allowed.includes(eventType)) {
    return new Response(null, { status: 400 })
  }

  await supabase.from('shadow_events').insert({
    post_id: postId,
    event_type: eventType,
    session_hash: sessionHash,
  })

  return new Response(null, { status: 204 })
}
