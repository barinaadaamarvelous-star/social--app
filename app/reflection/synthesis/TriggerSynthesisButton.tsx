'use client'

import { useTransition } from 'react'
import { generateSynthesis } from './action'

function getSynthesisPeriod(): {
  start: string
  end: string
} {
  const now = new Date()

  // Start of current year (UTC-safe)
  const start = new Date(
    Date.UTC(now.getUTCFullYear(), 0, 1, 0, 0, 0)
  ).toISOString()

  const end = now.toISOString()

  return { start, end }
}

export function TriggerSynthesisButton() {
  const [isPending, startTransition] = useTransition()

  function handleClick() {
    const { start, end } = getSynthesisPeriod()

    startTransition(async () => {
      await generateSynthesis(start, end)
    })
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="rounded-lg border px-4 py-2 text-sm opacity-80 hover:opacity-100 disabled:opacity-40"
    >
      {isPending ? 'compressing…' : 'generate synthesis (dev)'}
    </button>
  )
}
