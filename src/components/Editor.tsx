// src/components/Editor.tsx
'use client'

import React, { useState } from 'react'
import { supabase } from '@/lib/supabaseClient' // optional for fallback session

type Props = {
  // Server Action (optional). Name must end with "Action".
  onPostedAction?: (formData: FormData) => Promise<void>
}

export default function Editor({ onPostedAction }: Props) {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

  async function handlePost(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!content.trim()) return
    setLoading(true)

    try {
      if (onPostedAction) {
        const fd = new FormData()
        fd.set('content', content)
        await onPostedAction(fd)
        setContent('')
      } else {
        // Optionally keep a client-only fallback if you want (comment out if not)
        const { data: sessionData } = await supabase.auth.getSession()
        const user = sessionData.session?.user
        if (!user) {
          alert('You must sign in first')
          return
        }
        const res = await fetch('/api/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ author_id: user.id, content, image_url: null }),
        })
        if (res.ok) {
          setContent('')
        } else {
          const err = await res.json().catch(() => null)
          alert('Error: ' + (err?.error || 'Unknown'))
        }
      }
    } catch (err) {
      console.error(err)
      alert('Error while posting')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handlePost} style={{ margin: '12px 0' }}>
      <textarea
        name="content"
        placeholder="What's happening?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        style={{ width: '100%', minHeight: 80 }}
      />
      <div>
        <button type="submit" disabled={loading || !content.trim()}>
          {loading ? 'Posting...' : 'Post'}
        </button>
      </div>
    </form>
  )
}
