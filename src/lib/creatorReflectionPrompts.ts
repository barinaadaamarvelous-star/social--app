export type WeeklyPrompt = {
  id: string
  text: string
}

export const WEEKLY_PROMPTS: WeeklyPrompt[] = [
  {
    id: 'ease_vs_friction',
    text: 'What felt unexpectedly easy or hard this week?',
  },
  {
    id: 'energy_shift',
    text: 'Where did your energy increase or drain?',
  },
  {
    id: 'surprise_signal',
    text: 'What surprised you about how people responded?',
  },
  {
    id: 'craft_focus',
    text: 'What part of your craft did you pay the most attention to?',
  },
]
