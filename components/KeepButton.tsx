'use client'

import { useTransition } from 'react'
import { keepSynthesis } from '@/app/actions/keepSynthesis'

type KeepButtonProps = {
  synthesisId: string
}

export function KeepButton({ synthesisId }: KeepButtonProps) {
  const [isPending, startTransition] = useTransition()

  function handleClick() {
    startTransition(async () => {
      await keepSynthesis(synthesisId)
    })
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <p className="text-sm opacity-80">
          This synthesis can be kept.
        </p>

        <p className="text-xs opacity-60">
          It holds a summary of this period so you don’t have to.
        </p>
      </div>

      <button
        onClick={handleClick}
        disabled={isPending}
        className="rounded-lg border px-4 py-2 text-sm opacity-80 hover:opacity-100 disabled:opacity-40"
      >
        {isPending ? 'holding…' : 'Keep this — $12'}
      </button>

      <p className="text-xs opacity-50">
        One-time. No subscription. Nothing else is gated.
      </p>
    </div>
  )
}
