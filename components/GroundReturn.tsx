'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

export function GroundReturn() {
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const [active, setActive] = useState(false)
  const router = useRouter()

  function startPress() {
    timerRef.current = setTimeout(() => {
      setActive(true)
    }, 3000) // intentional 3s hold
  }

  function cancelPress() {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  function close() {
    setActive(false)
  }

  function closeForToday() {
    setActive(false)
    router.push('/')
  }

  // global long-press listeners
  useEffect(() => {
    window.addEventListener('mousedown', startPress)
    window.addEventListener('mouseup', cancelPress)
    window.addEventListener('touchstart', startPress)
    window.addEventListener('touchend', cancelPress)

    return () => {
      window.removeEventListener('mousedown', startPress)
      window.removeEventListener('mouseup', cancelPress)
      window.removeEventListener('touchstart', startPress)
      window.removeEventListener('touchend', cancelPress)
      cancelPress()
    }
  }, [])

  if (!active) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="max-w-sm w-full mx-4 rounded-2xl border border-neutral-700 bg-neutral-900 p-6 space-y-6">
        <p className="text-sm leading-relaxed opacity-90">
          You’re safe right now.
          <br />
          You don’t need to solve anything.
        </p>

        <div className="flex gap-4">
          <button
            onClick={close}
            className="flex-1 rounded-lg border px-4 py-2 opacity-70 hover:opacity-100"
          >
            stay
          </button>

          <button
            onClick={closeForToday}
            className="flex-1 rounded-lg border px-4 py-2 opacity-70 hover:opacity-100"
          >
            close for today
          </button>
        </div>
      </div>
    </div>
  )
}
