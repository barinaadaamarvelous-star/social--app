// src/components/Editor.tsx
'use client'
import React, { useState } from 'react'

export default function Editor() {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content,
        user_id: '00000000-0000-0000-0000-000000000000' // temporary fake id
      })
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      alert('Error: ' + (data?.error ?? 'unknown'))
      return
    }

    alert('Post created!')
    setContent('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea value={content} onChange={(e) => setContent(e.target.value)} />
      <button type="submit" disabled={loading}>
        {loading ? 'Posting...' : 'Post'}
      </button>
    </form>
  )
}
