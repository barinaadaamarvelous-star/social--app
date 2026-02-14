'use client'

import { useEffect, useState } from 'react'

export function ReturnShell({
  isReturn,
  children,
}: {
  isReturn: boolean
  children: React.ReactNode
}) {
  const [show, setShow] = useState(isReturn)

  useEffect(() => {
    if (!show) return

    const t = setTimeout(() => {
      setShow(false)
    }, 5000) // 5 seconds max

    return () => clearTimeout(t)
  }, [show])

  if (!show) return <>{children}</>

  return (
    <div
      onClick={() => setShow(false)}
      className="fixed inset-0 z-40 flex items-center justify-center bg-neutral-950"
    >
      <p className="text-sm opacity-70 text-center px-6">
        You’re back.  
        Nothing here needs your attention.
      </p>
    </div>
  )
}
