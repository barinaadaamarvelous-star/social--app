import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  // 🔐 Protect cron endpoint
  if (process.env.CRON_SECRET) {
    const auth = req.headers.get('authorization')
    if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
      return new NextResponse('Unauthorized', { status: 401 })
    }
  }

  // ✅ Dynamic imports (build safe)
  const { createClient } = await import('@supabase/supabase-js')
  const OpenAI = (await import('openai')).default

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const openaiKey = process.env.OPENAI_API_KEY

  if (!supabaseUrl || !serviceKey || !openaiKey) {
    return NextResponse.json(
      { error: 'Missing required environment variables' },
      { status: 500 }
    )
  }

  const supabase = createClient(supabaseUrl, serviceKey)

  const openai = new OpenAI({
    apiKey: openaiKey,
  })

  // 1️⃣ YEARLY PERIOD
  const now = new Date()
  const year = now.getUTCFullYear() - 1

  const periodStart = new Date(Date.UTC(year, 0, 1, 0, 0, 0)).toISOString()
  const periodEnd = new Date(Date.UTC(year, 11, 31, 23, 59, 59)).toISOString()

  // 2️⃣ USERS WITH REFLECTIONS
  const { data: rows, error } = await supabase
    .from('creator_reflections')
    .select('user_id')
    .gte('created_at', periodStart)
    .lte('created_at', periodEnd)

  if (error || !rows) {
    console.error(error)
    return NextResponse.json({ ok: false })
  }

  const userIds = Array.from(new Set(rows.map(r => r.user_id)))

  let generated = 0
  let skipped = 0

  for (const userId of userIds) {
    const { data: existing } = await supabase
      .from('reflection_syntheses')
      .select('id')
      .eq('user_id', userId)
      .eq('period_start', periodStart)
      .eq('period_end', periodEnd)
      .maybeSingle()

    if (existing) {
      skipped++
      continue
    }

    const { data: reflections } = await supabase
      .from('creator_reflections')
      .select('body')
      .eq('user_id', userId)
      .gte('created_at', periodStart)
      .lte('created_at', periodEnd)
      .order('created_at', { ascending: true })

    if (!reflections || reflections.length === 0) {
      skipped++
      continue
    }

    const combined = reflections
      .map((r, i) => `Entry ${i + 1}:\n${r.body}`)
      .join('\n\n')

    const completion = await openai.chat.completions.create({
      model: 'gpt-4.1-mini',
      temperature: 0.35,
      messages: [
        {
          role: 'system',
          content:
            'Create a calm, non-performative synthesis. No advice. No coaching. STRICT JSON.',
        },
        {
          role: 'user',
          content: `
Return JSON ONLY:

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
    if (!raw) {
      skipped++
      continue
    }

    let content
    try {
      content = JSON.parse(raw)
    } catch {
      skipped++
      continue
    }

    await supabase.from('reflection_syntheses').insert({
      user_id: userId,
      period_start: periodStart,
      period_end: periodEnd,
      content,
      paid: false,
    })

    generated++
  }

  return NextResponse.json({
    ok: true,
    generated,
    skipped,
  })
}