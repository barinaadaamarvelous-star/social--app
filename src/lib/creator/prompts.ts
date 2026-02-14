// Gentle, non-directive prompts
const PROMPTS = [
  'What felt unexpectedly easy or hard this week?',
  'What moment stayed with you longer than you expected?',
  'What did you learn about your process this week?',
  'What felt meaningful, even if it was small?',
  'What would you want to remember from this week later?',
]

// Pure function — no state, no side effects
export function getWeeklyPrompt(weekStart: string) {
  const index =
    Math.abs(
      Array.from(weekStart).reduce(
        (acc, char) => acc + char.charCodeAt(0),
        0
      )
    ) % PROMPTS.length

  return {
    text: PROMPTS[index],
    index,
  }
}
