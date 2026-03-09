'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

type SynthesisContent = {
  title: string
  summary: string
  themes: string[]
  notable_lines: string[]
}

export async function generateSynthesis(
  periodStart: string,
  periodEnd: string
) {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll() {},
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('Not authenticated')

  // 1️⃣ Guard: do not regenerate same period
  const { data: existing } = await supabase
    .from('reflection_syntheses')
    .select('id')
    .eq('user_id', user.id)
    .eq('period_start', periodStart)
    .eq('period_end', periodEnd)
    .maybeSingle()

  if (existing) {
    return {
      success: true,
      alreadyExists: true,
      synthesisId: existing.id,
    }
  }

  // 2️⃣ Fetch reflections
  const { data: reflections, error } = await supabase
    .from('creator_reflections')
    .select('body')
    .eq('user_id', user.id)
    .gte('created_at', periodStart)
    .lte('created_at', periodEnd)
    .order('created_at', { ascending: true })

  if (error) throw error
  if (!reflections || reflections.length === 0) {
    throw new Error('No reflections found')
  }

  const combined = reflections
    .map((r, i) => `Entry ${i + 1}:\n${r.body}`)
    .join('\n\n')

  // 3️⃣ Generate synthesis (STRICT JSON)
  const completion = await openai.chat.completions.create({
    model: 'gpt-4.1-mini',
    temperature: 0.35,
    messages: [
      {
        role: 'system',
        content: `
You create reflective summaries.

Rules:
- Calm
- Observational
- No advice
- No motivation
- No future planning
- Return STRICT JSON only
        `.trim(),
      },
      {
        role: 'user',
        content: `
Return JSON EXACTLY in this shape:

{
  "title": "",
  "summary": "",
  "themes": [],
  "notable_lines": []
}

Reflections:
${combined}
        `.trim(),
      },
    ],
  })

  const raw = completion.choices[0]?.message?.content
  if (!raw) throw new Error('Empty model response')

  let content: SynthesisContent
  try {
    content = JSON.parse(raw)
  } catch {
    throw new Error('Model returned invalid JSON')
  }

  // 4️⃣ Persist
  const { data: inserted, error: insertError } = await supabase
    .from('reflection_syntheses')
    .insert({
      user_id: user.id,
      period_start: periodStart,
      period_end: periodEnd,
      content,
      paid: false,
    })
    .select('id')
    .single()

  if (insertError) throw insertError

  revalidatePath('/reflection/synthesis')

  return {
    success: true,
    synthesisId: inserted.id,
  }
}
