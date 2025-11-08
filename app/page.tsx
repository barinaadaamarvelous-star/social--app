// app/page.tsx
'use client'

import React from 'react'
import Editor from '@/components/Editor'

export default function HomePage() {
  return (
    <main>
      <h1>Home</h1>
      <Editor /> {/* no onPosted prop */}
    </main>
  )
}
