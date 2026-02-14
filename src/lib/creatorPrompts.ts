export const CREATOR_PROMPTS: Record<
  string,
  {
    title: string
    body: string
  }
> = {
  quiet_resonance: {
    title: 'Quiet resonance',
    body:
      'Readers spent more time with this than usual. What do you think held their attention?',
  },

  save_intent_detected: {
    title: 'Return intent',
    body:
      'People showed signs of wanting to return to this. What might they be coming back for?',
  },

  rewatch_above_baseline: {
    title: 'Revisit pattern',
    body:
      'This was revisited after first viewing. Does this connect to something you’ve been thinking about lately?',
  },

  normal_engagement: {
    title: 'Within your range',
    body:
      'This performed within your usual range. Anything you’d approach differently if you revisited it?',
  },
}
