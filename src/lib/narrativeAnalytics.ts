type NarrativeInsight = {
  title: string
  description: string
}

export function generateNarrativeInsights(
  reflections: { body: string; created_at: string }[]
): NarrativeInsight[] {
  if (reflections.length === 0) return []

  const insights: NarrativeInsight[] = []

  // ─────────────────────────────
  // Time-based framing (no counts)
  // ─────────────────────────────
  insights.push({
    title: 'Time perspective',
    description:
      'Your reflections span different moments in time. Each was written from a specific place, not a permanent truth.',
  })

  // ─────────────────────────────
  // Language presence (not sentiment)
  // ─────────────────────────────
  const usesUncertainty = reflections.some(r =>
    /(maybe|not sure|i think|unclear)/i.test(r.body)
  )

  if (usesUncertainty) {
    insights.push({
      title: 'Uncertainty appears',
      description:
        'Some reflections were written while you were still figuring things out. This doesn’t need resolution.',
    })
  }

  const usesCertainty = reflections.some(r =>
    /(always|never|nothing|everything)/i.test(r.body)
  )

  if (usesCertainty) {
    insights.push({
      title: 'Strong language moments',
      description:
        'At times your writing used strong, absolute language. These often come from intensity, not permanence.',
    })
  }

  // ─────────────────────────────
  // Closure without conclusion
  // ─────────────────────────────
  insights.push({
    title: 'No summary required',
    description:
      'These reflections are not asking to be combined into a single story.',
  })

  return insights
}
