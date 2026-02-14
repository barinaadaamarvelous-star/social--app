import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { generateSynthesis } from './action'
import { KeepButton } from '@/components/KeepButton'
import { TriggerSynthesisButton } from './TriggerSynthesisButton'


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

  // ── fetch latest synthesis ──────────────────
  const { data: synthesis } = await supabase
    .from('reflection_syntheses')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  // ── TEMP trigger UI (internal only) ─────────
  if (!synthesis) {
    return (
      <main className="max-w-2xl mx-auto py-12 space-y-6">
        <p className="opacity-60">
          Nothing has settled yet.
        </p>

        {/* TEMP — remove later */}
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

  // ── unpaid gate ─────────────────────────────
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

      {/* ── Paid Moment ───────────────────── */}
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
          {/* Primary: Continue free */}
          <a
            href="/dashboard"
            className="block w-full text-center border rounded-xl py-3 text-sm opacity-80 hover:opacity-100 transition"
          >
            Continue free
          </a>

          {/* Secondary: Keep */}
          <KeepButton synthesisId={synthesis.id} />

          {/* Calm refund language */}
          <p className="text-xs text-center opacity-50 pt-2">
            7-day refund. If it doesn’t help you think clearly, get your money back.
          </p>
        </div>
      </section>
    </main>
  )
}
}