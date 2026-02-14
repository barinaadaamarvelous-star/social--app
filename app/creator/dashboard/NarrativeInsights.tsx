import { generateNarrativeInsights } from '@/lib/narrativeAnalytics'

export function NarrativeInsights({
  reflections,
}: {
  reflections: { body: string; created_at: string }[]
}) {
  const insights = generateNarrativeInsights(reflections)

  if (insights.length === 0) return null

  return (
    <section className="space-y-4">
      <h2 className="text-lg">Reflection context</h2>

      <ul className="space-y-3">
        {insights.map((insight, i) => (
          <li key={i}>
            <strong>{insight.title}</strong>
            <p className="opacity-70">{insight.description}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
