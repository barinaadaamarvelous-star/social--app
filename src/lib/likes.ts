import { createClient } from '@supabase/supabase-js'
import {
  beforeLikeAction,
  afterLikeAction,
  onLikeActionError,
} from './likeHooks'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function toggleLike(
  postId: string,
  isLiked: boolean
) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    throw new Error('User not authenticated')
  }

  const ctx = {
    userId: user.id,
    postId,
    action: isLiked ? 'unlike' : 'like',
    timestamp: Date.now(),
  } as const

  // 🧠 PRE-HOOK (no-op for now)
  await beforeLikeAction(ctx)

  try {
    if (isLiked) {
      const { error } = await supabase
        .from('likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', user.id)

      if (error) throw error
    } else {
      const { error } = await supabase
        .from('likes')
        .insert({
          post_id: postId,
          user_id: user.id,
        })

      if (error) throw error
    }

    // 🧠 POST-HOOK (no-op)
    await afterLikeAction(ctx)
  } catch (err) {
    // 🧠 ERROR-HOOK (no-op)
    await onLikeActionError(ctx, err)
    throw err
  }
}
