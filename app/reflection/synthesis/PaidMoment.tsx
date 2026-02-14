'use client'

import { useTransition } from 'react'
import { redirectToStripeCheckout } from './stripe'

export function PaidMoment() {
  const [isPending, startTransition] = useTransition()

  function handlePaid() {
    startTransition(async () => {
      await redirectToStripeCheckout()
    })
  }

  function handleContinueFree() {
    // lawful, respected exit
    window.location.href = '/reflection'
  }

  return (
    <div className="mx-auto max-w-md space-y-6 rounded-xl border border-neutral-800 bg-neutral-950 p-6 text-neutral-200">
      {/* Context */}
      <div className="space-y-2">
        <h2 className="text-lg font-medium">
          Your yearly synthesis is ready
        </h2>
        <p className="text-sm text-neutral-400">
          This is a calm compression of your reflections across the year.
          No advice. No optimization. Just a clear mirror.
        </p>
      </div>

      {/* Primary CTA — FREE */}
      <button
        onClick={handleContinueFree}
        className="w-full rounded-lg border border-neutral-700 px-4 py-3 text-sm hover:border-neutral-500"
      >
        Continue free
      </button>

      {/* Paid CTA */}
      <button
        onClick={handlePaid}
        disabled={isPending}
        className="w-full rounded-lg bg-neutral-200 px-4 py-3 text-sm font-medium text-neutral-900 hover:bg-white disabled:opacity-50"
      >
        {isPending ? 'Opening checkout…' : 'Unlock yearly synthesis — $12'}
      </button>

      {/* Refund / regret edge */}
      <p className="text-xs text-neutral-500">
        7-day refund. If it doesn’t help you think more clearly,
        get your money back.
      </p>

      {/* Pass options — visible, neutral */}
      <div className="space-y-1 text-xs text-neutral-500">
        <button
          onClick={handleContinueFree}
          className="block hover:text-neutral-300"
        >
          Not now
        </button>
        <button
          onClick={handleContinueFree}
          className="block hover:text-neutral-300"
        >
          I’ll continue free
        </button>
        <button
          onClick={handleContinueFree}
          className="block hover:text-neutral-300"
        >
          Skip for now
        </button>
      </div>
    </div>
  )
}
