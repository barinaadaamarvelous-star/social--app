// Echo Contract — canonical truth source
// If these rules change, design review is required first.

export const EchoContract = {
  defaultCollapsed: true,

  // Echo is allowed to reveal ONLY by user intent
  canReveal(userAction: boolean) {
    return userAction === true;
  },

  // Echo must always allow re-hide
  canHide(userAction: boolean) {
    return userAction === true;
  },

  // Echo must never auto-surface
  mustNotAutoSurface() {
    return true;
  },

  // Echo must never compare users
  forbidsComparison() {
    return true;
  },
  
  // Echo must never infer emotion
  mustNotInferEmotion() {
   throw new Error('Emotion inference is disallowed by EchoContract')
  },
} as const;
