import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { ReflectionEcho } from '@/components/creator/ReflectionEcho'

export default async function EchoPage() {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
  get(name: string) {
    return cookieStore.get(name)?.value
  },
 }
}
  )
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return (
      <main className="max-w-2xl mx-auto py-10">
        <p>Please sign in to view echo.</p>
      </main>
    )
  }

  // fetch MOST RECENT reflection — not all
  const { data: reflection } = await supabase
    .from('creator_reflections')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  // convert to echo shape
  const echo = reflection
    ? {
        week_start: reflection.created_at,
        body: reflection.body,
      }
    : null

  return (
    <main className="max-w-2xl mx-auto py-10">
      <h1 className="text-xl mb-6">
        Echo
      </h1>

      <ReflectionEcho echo={echo} />
    </main>
  )
}
