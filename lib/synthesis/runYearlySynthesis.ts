'use server'

import { createClient } from '@supabase/supabase-js'
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

export async function runYearlySynthesisForUser(userId: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const now = new Date()
  const periodStart = new Date(now.getFullYear(), 0, 1).toISOString()
  const periodEnd = now.toISOString()

  // Guard: do not regenerate same synthesis
  const { data: existing } = await supabase
    .from('reflection_syntheses')
    .select('id')
    .eq('user_id', userId)
    .eq('period_start', periodStart)
    .eq('period_end', periodEnd)
    .maybeSingle()

  if (existing) return { skipped: true }

  const { data: reflections } = await supabase
    .from('creator_reflections')
    .select('body')
    .eq('user_id', userId)
    .gte('created_at', periodStart)
    .lte('created_at', periodEnd)
    .order('created_at', { ascending: true })

  if (!reflections || reflections.length === 0) {
    return { skipped: true }
  }

  const combined = reflections
    .map((r, i) => `Entry ${i + 1}:\n${r.body}`)
    .join('\n\n')

  const completion = await openai.chat.completions.create({
    model: 'gpt-4.1',
    temperature: 0.4,
    messages: [
      {
        role: 'system',
        content:
          'Create a calm, non-performative synthesis of these reflections. Do not coach. Do not optimize.',
      },
      {
        role: 'user',
        content: `
Return STRICT JSON only:

{
  "title": "",
  "summary": "",
  "themes": [],
  "notable_lines": []
}

Reflections:
${combined}
        `,
      },
    ],
  })

  const raw = completion.choices[0].message.content
  if (!raw) throw new Error('Empty model response')

  const content = JSON.parse(raw) as SynthesisContent

  await supabase.from('reflection_syntheses').insert({
    user_id: userId,
    period_start: periodStart,
    period_end: periodEnd,
    content,
    paid: false,
  })

  return { created: true }
}
