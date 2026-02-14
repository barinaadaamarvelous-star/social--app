import { WEEKLY_PROMPTS } from './creatorReflectionPrompts'

export function getWeeklyPrompt(weekStart: string) {
  // stable rotation based on week index
  const weekNumber = Math.floor(
    new Date(weekStart).getTime() / (1000 * 60 * 60 * 24 * 7)
  )

  const index = weekNumber % WEEKLY_PROMPTS.length
  return WEEKLY_PROMPTS[index]
}