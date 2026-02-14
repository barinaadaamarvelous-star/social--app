// src/lib/likeHooks.ts

export type LikeActionContext = {
  userId: string
  postId: string
  action: 'like' | 'unlike'
  timestamp: number
}

/**
 * Called BEFORE toggleLike hits the DB
 */
export async function beforeLikeAction(
  _ctx: LikeActionContext
): Promise<void> {
  // G2.4 — intentionally empty
}

/**
 * Called AFTER successful DB mutation
 */
export async function afterLikeAction(
  _ctx: LikeActionContext
): Promise<void> {
  // G2.4 — intentionally empty
}

/**
 * Called when DB mutation fails
 */
export async function onLikeActionError(
  _ctx: LikeActionContext,
  _error: unknown
): Promise<void> {
  // G2.4 — intentionally empty
}

// src/lib/likeHooks.ts

type LikePattern = {
  burst: boolean
  flipFlop: boolean
  rapidRepeat: boolean
}

function detectPatterns(
  timestamps: number[]
): LikePattern {
  if (timestamps.length < 2) {
    return { burst: false, flipFlop: false, rapidRepeat: false }
  }

  const last = timestamps[timestamps.length - 1]
  const prev = timestamps[timestamps.length - 2]

  const delta = last - prev

  return {
    burst: timestamps.length >= 3 && delta < 600,
    rapidRepeat: delta < 300,
    flipFlop: false, // filled later
  }
}
