import { createClient } from '@supabase/supabase-js'

export async function getReflectionEcho(userId: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  return supabase
    .from('reflection_echo')
    .select('*')
    .eq('user_id', userId)
    .single()
}
