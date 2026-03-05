import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { generateSynthesis } from './action'
import { KeepButton } from '@/components/KeepButton'
import { TriggerSynthesisButton } from './TriggerSynthesisButton'
import Link from "next/link";

export default async function SynthesisPage({
  searchParams,
}: {
  searchParams: { paid?: string }
}) {
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
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // ── reflection count this year ─────────────
  const startOfYear = new Date(new Date().getFullYear(), 0, 1).toISOString()

  const { count: reflectionCount } = await supabase
    .from('creator_reflections')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .gte('created_at', startOfYear)

  // ── fetch latest synthesis ─────────────────
  const { data: synthesis } = await supabase
    .from('reflection_syntheses')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  // ── server action: respond to synthesis ────
  async function respondToYear(formData: FormData) {
    'use server'

    const body = formData.get('body') as string

    if (!body || body.trim().length === 0) return

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
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    await supabase.from('creator_reflections').insert({
      user_id: user.id,
      body: body.trim(),
    })
  }

  // ── TEMP trigger UI (internal only) ────────
  if (!synthesis) {
    return (
      <main className="max-w-2xl mx-auto py-12 space-y-6">
        <p className="opacity-60">
          Nothing has settled yet.
        </p>

        <form
          action={async () => {
            'use server'
            await generateSynthesis(
              new Date(Date.now() - 7 * 86400000).toISOString(),
              new Date().toISOString()
            )
          }}
        >
          <button className="text-sm underline opacity-50">
            generate weekly synthesis
          </button>
        </form>
      </main>
    )
  }

  // ── unpaid gate ────────────────────────────
  if (!synthesis.paid) {
    return (
      <main className="max-w-2xl mx-auto py-16 space-y-10">
        <section className="space-y-4">
          <p className="text-sm opacity-70">
            A synthesis has formed from this period.
          </p>

          <p className="text-sm opacity-70">
            You can read it now. Keeping it is optional.
          </p>
        </section>

        <section className="border rounded-2xl p-8 space-y-6">
          <div className="space-y-3">
            <h2 className="text-base font-medium">
              Keep this permanently — $12
            </h2>

            <p className="text-sm opacity-70 leading-relaxed">
              This preserves the synthesis in your archive.
              One payment. No subscription.
            </p>
          </div>

          <div className="space-y-4">
            <a
              href="/dashboard"
              className="block w-full text-center border rounded-xl py-3 text-sm opacity-80 hover:opacity-100 transition"
            >
              Continue free
            </a>

            <KeepButton synthesisId={synthesis.id} />

            <p className="text-xs text-center opacity-50 pt-2">
              7-day refund. If it doesn’t help you think clearly, get your money back.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-sm font-medium opacity-80">
            Respond to this year
          </h3>

          <p className="text-xs opacity-60">
            What feels true? What feels unfinished?
          </p>

          <form action={respondToYear} className="space-y-4">
            <textarea
              name="body"
              rows={6}
              placeholder="Write your response..."
              className="w-full border rounded-xl p-4 text-sm resize-none focus:outline-none"
            />

            <button
              type="submit"
              className="text-sm border rounded-lg px-4 py-2 opacity-80 hover:opacity-100 transition"
            >
              Save reflection
            </button>
          </form>
        </section>
      </main>
    )
  }

  // ── paid synthesis view ────────────────────
  return (
    <main className="max-w-2xl mx-auto py-16 space-y-10">

      {/* archive link */}
      <div className="flex justify-end">
        <a
          href="/synthesis/archive"
          className="text-xs opacity-60 hover:opacity-100 underline transition"
        >
          View past syntheses
        </a>
      </div>

      {/* reflection count */}
      <p className="text-xs opacity-60">
        {reflectionCount ?? 0} reflections this year
      </p>

      {/* synthesis content */}
      <section className="space-y-6">
        <pre className="text-sm whitespace-pre-wrap opacity-90">
          {JSON.stringify(synthesis.content, null, 2)}
        </pre>
      </section>

      {/* respond section */}
      <section className="space-y-4">
        <h3 className="text-sm font-medium opacity-80">
          Respond to this year
        </h3>

        <p className="text-xs opacity-60">
          What feels true? What feels unfinished?
        </p>

        <form action={respondToYear} className="space-y-4">
          <textarea
            name="body"
            rows={6}
            placeholder="Write your response..."
            className="w-full border rounded-xl p-4 text-sm resize-none focus:outline-none"
          />

          <button
            type="submit"
            className="text-sm border rounded-lg px-4 py-2 opacity-80 hover:opacity-100 transition"
          >
            Save reflection
          </button>
        </form>
      </section>

    </main>
  )
}