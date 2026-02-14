'use client'

import { useState, useTransition } from 'react'
import { saveReflection } from '../actions'
import { useRouter } from 'next/navigation'

type ReflectionFormProps = {
  userId: string
  weekStart: string
}

type Phase = 'writing' | 'closing'

export function ReflectionForm({
  userId,
  weekStart,
}: ReflectionFormProps) {
  const [text, setText] = useState('')
  const [phase, setPhase] = useState<Phase>('writing')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  // ── CLOSING STATE ─────────────────────────────
  if (phase === 'closing') {
    return (
      <div className="rounded-xl border p-6 space-y-4 opacity-90">
        <p className="text-sm">
          You don’t need to hold this anymore.
        </p>

        <p className="text-sm opacity-70">
          It will still be here when you come back.
        </p>

        <button
          onClick={() => router.push('/reflection')}
          className="text-sm underline opacity-60"
        >
          leave quietly
        </button>
      </div>
    )
  }

  // ── WRITING STATE ─────────────────────────────
  return (
    <form
      action={(formData) => {
        startTransition(async () => {
          const result = await saveReflection(formData)

          if (result?.success || result?.locked) {
            setPhase('closing')
          }
        })
      }}
      className="space-y-4"
    >
      {/* server truth */}
      <input type="hidden" name="user_id" value={userId} />
      <input type="hidden" name="week_start" value={weekStart} />

      {/* containment framing */}
      <p className="text-sm opacity-70">
        This space holds one thought at a time.
      </p>

      <textarea
        name="body"
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={isPending}
        rows={6}
        className="w-full p-3 rounded-lg border border-neutral-700 disabled:opacity-50"
        placeholder="Write anything that feels useful. Short is okay."
      />

      <button
        type="submit"
        disabled={isPending || !text.trim()}
        className="px-4 py-2 rounded-lg border disabled:opacity-50"
      >
        {isPending ? 'Saving…' : 'Save'}
      </button>
    </form>
  )
}
