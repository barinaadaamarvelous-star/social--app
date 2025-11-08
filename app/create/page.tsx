// app/create/page.tsx  (server component)
import Editor from '@/components/Editor'
import { supabaseAdmin } from '@/lib/supabaseAdmin' // server-only admin client
import React from 'react'

export default function Page() {
  async function onPostedAction(formData: FormData) {
    'use server'
    const content = (formData.get('content') as string | null)?.trim()
    if (!content) return

    const { error } = await supabaseAdmin.from('posts').insert([{ content }])
    if (error) {
      console.error('Insert error:', error)
      throw new Error('Failed to create post')
    }
  }

  return (
    <main>
      <h1>Create</h1>
      <Editor onPostedAction={onPostedAction} />
    </main>
  )
}
