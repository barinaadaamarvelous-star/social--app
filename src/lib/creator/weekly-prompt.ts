/**
 * Gentle, non-directive weekly reflection prompts.
 * Pure function. No state. No storage. No analytics.
 */

const PROMPTS = [
  'What stayed with you this week?',
  'What felt heavier than expected?',
  'What gave you a small sense of relief?',
  'What did you avoid, and why?',
  'What surprised you about yourself?',
  'What drained you more than it should have?',
  'What helped you keep going?',
  'What would you like to leave behind this week?',
  'What deserves a little compassion right now?',
  'What felt quietly important?',
]

export function getWeeklyPrompt(weekStart: string): string {
  /**
   * weekStart must be YYYY-MM-DD
   * Deterministic index based on date string
   */
  let hash = 0

  for (let i = 0; i < weekStart.length; i++) {
    hash = (hash << 5) - hash + weekStart.charCodeAt(i)
    hash |= 0
  }

  const index = Math.abs(hash) % PROMPTS.length
  return PROMPTS[index]
}
