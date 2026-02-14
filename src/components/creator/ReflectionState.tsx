// src/components/creator/ReflectionState.tsx
import './ReflectionState.css'

export function ReflectionState({
  reflection,
}: {
  reflection: {
    body: string | null
    status: string
  } | null
}) {
  // no reflection this week — neutral, allowed state
  if (!reflection || reflection.status === 'empty') {
    return (
      <p className="reflection-empty">
        No reflection this week — that’s okay.
      </p>
    )
  }

  return (
    <div className="reflection-written">
      <p className="reflection-label">
        Your private reflection
      </p>
      <p className="reflection-body">
        {reflection.body}
      </p>
    </div>
  )
}
