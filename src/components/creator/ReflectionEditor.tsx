'use client'

import './ReflectionEditor.css'
import { useState } from 'react'

type Props = {
  reflectionId: string | null
  body: string | null
  locked: boolean
  status: 'empty' | 'written' | 'skipped'
  weekStart: string
  prompt: string
}

export default function ReflectionEditor({
  reflectionId,
  body,
  locked,
  status,
  prompt,
}: Props) {
  const [reason, setReason] = useState('')
  const [unlocked, setUnlocked] = useState(false)

  const handleEmergencyUnlock = async () => {
    const res = await fetch(
      '/api/creator/reflection/emergency-unlock',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reflectionId,
          reason,
        }),
      }
    )

    if (res.ok) {
      setUnlocked(true)
    }
  }

  return (
    <div>
      {/* 🧭 Weekly prompt (always visible, calm) */}
      <p className="reflection-prompt">{prompt}</p>

      {/* 🔒 Locked state */}
      {locked && !unlocked ? (
        <>
          <p className="reflection-locked">
            This reflection is now locked to preserve the
            integrity of the moment.
          </p>

          <details className="emergency-unlock">
            <summary>Need to make a correction?</summary>

            <p className="unlock-note">
              Emergency unlocks are rare and permanent.
              Use only if something important was missed.
            </p>

            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Briefly explain why you need to unlock this reflection"
            />

            <button
              className="unlock-button"
              disabled={reason.length < 10}
              onClick={handleEmergencyUnlock}
            >
              Unlock reflection
            </button>
          </details>
        </>
      ) : status === 'empty' ? (
        /* 🌱 No reflection this week — no guilt */
        <p className="reflection-empty">
          No reflection this week — that’s okay.
        </p>
      ) : (
        /* ✍️ Editable reflection */
        <textarea
          defaultValue={body ?? ''}
          placeholder="Write your reflection…"
        />
      )}
    </div>
  )
}

