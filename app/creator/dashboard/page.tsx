import { createClient } from '@supabase/supabase-js'
import { motion } from 'framer-motion'
import { NarrativeInsights } from './NarrativeInsights'


import { EchoPanel } from './EchoPanel'
import { DashboardContract } from '@/contracts/dashboard.contract'
import { inertia } from '@/lib/inertia'

type Reflection = {
  id: string
  body: string
  created_at: string
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

function getFirstLine(text: string) {
  return text.split('\n')[0]?.trim() ?? ''
}

export default async function CreatorDashboardPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // ─────────────────────────────
  // Invariants
  // ─────────────────────────────
  DashboardContract.forbidMetrics()
  DashboardContract.forbidComparisons()
  DashboardContract.forbidUrgency()

  // ─────────────────────────────
  // Auth
  // ─────────────────────────────
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return (
      <main className="max-w-2xl mx-auto py-10">
        <h1 className="text-xl mb-2">Creator Dashboard</h1>
        <p>You must be logged in to view your dashboard.</p>
      </main>
    )
  }

  // ─────────────────────────────
  // Reflections
  // ─────────────────────────────
  const { data: reflections, error } = await supabase
    .from('creator_reflections')
    .select('id, body, created_at')
    .order('created_at', { ascending: false })
    .limit(10)

  return (
    <main className="max-w-2xl mx-auto py-10 space-y-10">
      <header>
        <h1 className="text-xl mb-2">Creator Dashboard</h1>
        <p className="opacity-70">
          This is a private space. No scores, streaks, or rankings —
          just your words, held quietly.
        </p>
      </header>

      {/* Recent Reflections */}
      <section className="space-y-3">
        <h2 className="text-lg">Recent Reflections</h2>

        <NarrativeInsights reflections={reflections ?? []} />

        {error && (
          <p className="opacity-70">
            Unable to load reflections.
          </p>
        )}

        {!error && reflections && reflections.length === 0 && (
          <p className="opacity-70">
            You haven’t written any reflections yet.
          </p>
        )}

        {!error && reflections && reflections.length > 0 && (
          <motion.ul {...inertia.fadeIn} className="space-y-2">
            {reflections.map((reflection: Reflection) => (
              <li key={reflection.id} className="opacity-90">
                <strong>
                  {getFirstLine(reflection.body) ||
                    'Untitled reflection'}
                </strong>{' '}
                <span className="opacity-60">
                  ({formatDate(reflection.created_at)})
                </span>
              </li>
            ))}
          </motion.ul>
        )}
      </section>

      {/* Echo Panel */}
      <EchoPanel userId={user.id} />

      {/* Gentle actions */}
      <section>
        <h2 className="text-lg">Writing</h2>
        <p className="opacity-70">
          Available.
        </p>
      </section>


      <section>
        <h2 className="text-lg">Upcoming Prompts</h2>
        <p className="opacity-70">
          Suggested prompts will appear here.
        </p>
      </section>
    </main>
  )
}
