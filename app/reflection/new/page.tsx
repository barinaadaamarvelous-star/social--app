import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { ReflectionForm } from './ReflectionClient'

function startOfWeek(date = new Date()) {
  const d = new Date(date)
  const day = d.getDay() || 7
  if (day !== 1) d.setDate(d.getDate() - (day - 1))
  d.setHours(0, 0, 0, 0)
  return d.toISOString().slice(0, 10)
}

export default async function NewReflectionPage() {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const weekStart = startOfWeek()

  const { data: existing } = await supabase
    .from('creator_reflections')
    .select('id, created_at')
    .eq('user_id', user.id)
    .eq('week_start', weekStart)
    .maybeSingle()

  const isLocked = Boolean(existing)

  return (
    <main className="max-w-2xl mx-auto py-10 space-y-6">
      <header>
        <h1 className="text-xl">Weekly reflection</h1>
      </header>

      {isLocked ? (
        <LockState />
      ) : (
        <ReflectionForm userId={user.id} weekStart={weekStart} />
      )}
    </main>
  )
}

function LockState() {
  return (
    <div className="rounded-xl border p-6 space-y-3 opacity-90">
      <p className="text-sm">
        This week already has a place to rest.
      </p>

      <p className="text-sm opacity-70">
        You don’t need to add anything else right now.
      </p>
    </div>
  )
}
