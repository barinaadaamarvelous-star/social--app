'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'

export default function LoginPage() {
  // ─────────────────────────────
  // Supabase browser client (PKCE)
  // ─────────────────────────────
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        flowType: 'pkce',
      },
    }
  )

  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // ─────────────────────────────
  // Magic link login
  // ─────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: 'http://localhost:3000/auth/callback',
      },
    })

    if (error) {
      setError(error.message)
    } else {
      setSent(true)
    }
  }

  // ─────────────────────────────
  // Render
  // ─────────────────────────────
  return (
    <main className="max-w-sm mx-auto py-20">
      <h1 className="text-xl mb-4">Sign in</h1>

      {sent ? (
        <p>Check your email for the sign-in link.</p>
      ) : (
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            name="email"
            id="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border px-3 py-2 w-full"
          />

          <button type="submit" className="border px-3 py-2 w-full">
            Send sign-in link
          </button>

          {error && <p className="text-red-500">{error}</p>}
        </form>
      )}
    </main>
  )
}

