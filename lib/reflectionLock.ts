// lib/reflectionLock.ts
export function isEditable(reflection: {
  created_at: string
  locked_at: string | null
  emergency_unlocked_at: string | null
}) {
  if (reflection.emergency_unlocked_at) return true
  if (reflection.locked_at) return false

  const created = new Date(reflection.created_at).getTime()
  const now = Date.now()
  const HOURS_48 = 48 * 60 * 60 * 1000

  return now - created < HOURS_48
}
