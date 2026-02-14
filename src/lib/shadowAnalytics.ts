const SESSION_KEY = 'shadow_session'

function getSessionHash() {
  let hash = sessionStorage.getItem(SESSION_KEY)
  if (!hash) {
    hash = crypto.randomUUID()
    sessionStorage.setItem(SESSION_KEY, hash)
  }
  return hash
}

export async function logShadowEvent(
  postId: string,
  eventType: string
) {
  try {
    await fetch('/api/shadow', {
      method: 'POST',
      body: JSON.stringify({
        postId,
        eventType,
        sessionHash: getSessionHash(),
      }),
    })
  } catch {
    // silent fail — analytics must never affect UX
  }
}
