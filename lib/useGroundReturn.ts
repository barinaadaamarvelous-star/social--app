import { useEffect, useRef, useState } from 'react'

export function useGroundReturn() {
  const timer = useRef<NodeJS.Timeout | null>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const start = () => {
      timer.current = setTimeout(() => setOpen(true), 3000)
    }

    const cancel = () => {
      if (timer.current) clearTimeout(timer.current)
    }

    window.addEventListener('mousedown', start)
    window.addEventListener('mouseup', cancel)
    window.addEventListener('touchstart', start)
    window.addEventListener('touchend', cancel)

    return () => {
      window.removeEventListener('mousedown', start)
      window.removeEventListener('mouseup', cancel)
      window.removeEventListener('touchstart', start)
      window.removeEventListener('touchend', cancel)
    }
  }, [])

  return { open, setOpen }
}
