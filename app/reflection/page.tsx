import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { isReturningUser } from '@/lib/returnState'
import { ReturnShell } from '@/components/ReturnShell'
import { autoGenerateSynthesis } from './synthesis/autoGenerate'


function timeDistance(date: string) {
  const d = new Date(date)
  const now = new Date()
  const diff = now.getTime() - d.getTime()

  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(mins / 60)
  const days = Math.floor(hours / 24)

  if (mins < 60) return 'earlier'
  if (hours < 24) return 'today'
  if (days === 1) return 'yesterday'
  if (days < 7) return `${days} days ago`
  return 'some time ago'
}

export default async function ReflectionHistoryPage() {
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

  // ── auth ─────────────────────────────
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // ── reflections (compressed memory) ──
  const { data: reflections, error } = await supabase
    .from('creator_reflections')
    .select('id, body, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const isReturn = isReturningUser(reflections?.length ?? 0)
  await autoGenerateSynthesis()


  if (error) {
    return (
      <main className="max-w-2xl mx-auto py-10">
        <p className="opacity-60">
          This space couldn’t load right now.
        </p>
      </main>
    )
  }

  return (
    <ReturnShell isReturn={isReturn}>
      <main className="max-w-2xl mx-auto py-10 space-y-8">
        <header className="space-y-2">
          <h1 className="text-xl">You’ve been here before</h1>

          <p className="text-sm opacity-60">
            Not everything needs to be remembered to matter.
          </p>

          <Link
            href="/reflection/new"
            className="text-sm underline opacity-70"
          >
            write again
          </Link>
        </header>

        {!reflections?.length && (
          <p className="opacity-60">
            Nothing here yet — whenever you’re ready.
          </p>
        )}

        <ul className="space-y-6">
          {reflections?.map((r) => (
            <li
              key={r.id}
              className="rounded-xl border p-4 space-y-3"
            >
              {/* time = presence marker */}
              <p className="text-xs opacity-50">
                {timeDistance(r.created_at)}
              </p>

              {/* compressed content */}
              <details className="group">
                <summary className="text-sm opacity-70 cursor-pointer list-none">
                  <span className="group-open:hidden">
                    a quiet moment
                  </span>
                  <span className="hidden group-open:inline">
                    close
                  </span>
                </summary>

                <p className="mt-3 whitespace-pre-wrap text-sm opacity-80">
                  {r.body}
                </p>
              </details>
            </li>
          ))}
        </ul>
      </main>
    </ReturnShell>
  )
}
