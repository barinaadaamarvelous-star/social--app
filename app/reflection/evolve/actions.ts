'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import OpenAI from 'openai'
import { revalidatePath } from 'next/cache'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

export async function evolveIdea(formData: FormData) {
  const synthesisId = formData.get('synthesisId') as string
  const inputText = formData.get('inputText') as string
  const type = (formData.get('type') as string) || 'evolve'
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

  const completion = await openai.chat.completions.create({
    model: 'gpt-4.1-mini',
    temperature: 0.4,
    messages: [
      {
        role: 'system',
        content: `
You evolve ideas thoughtfully.

Rules:
- Extend the idea
- Introduce deeper perspective
- No motivational language
- Return JSON

Format:

{
 "evolved_insight": "",
 "new_questions": []
}
        `,
      },
      {
        role: 'user',
        content: inputText,
      },
    ],
  })

  const raw = completion.choices[0].message?.content || '{}'
  const output = JSON.parse(raw)

  const { error } = await supabase
    .from('reflection_evolutions')
    .insert({
      synthesis_id: synthesisId,
      user_id: user.id,
      input_text: inputText,
      ai_output: output,
      type: 'evolve',
    })

  if (error) throw error

  revalidatePath('/synthesis/archive')
}