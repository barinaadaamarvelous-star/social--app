import { createClient } from '@supabase/supabase-js'
import { ReflectionEcho } from '@/components/creator/ReflectionEcho'

type EchoRow = {
  week_start: string
  body: string
}

export async function EchoPanel({ userId }: { userId: string }) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data: echo } = await supabase
    .from('reflection_echo')
    .select('week_start, body')
    .eq('user_id', userId)
    .order('week_start', { ascending: false })
    .limit(1)
    .maybeSingle<EchoRow>()

  // silence is valid
  if (!echo) return null

  return (
    <section>
      <h2 className="text-sm opacity-70 mb-2">
        Something from before
      </h2>

      <ReflectionEcho echo={echo} />
    </section>
  )
}
