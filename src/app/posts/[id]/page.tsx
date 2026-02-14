// src/app/posts/[id]/page.tsx
import { createServerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import LikeButton from '@/components/LikeButton'

export default async function PostPage({
  params,
}: {
  params: { id: string }
}) {
  const postId = params.id

  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // total likes count
  const { count } = await supabase
    .from('likes')
    .select('*', { count: 'exact', head: true })
    .eq('post_id', postId)

  // did this user like?
  let initiallyLiked = false

  if (user) {
    const { data } = await supabase
      .from('likes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', user.id)
      .maybeSingle()

    initiallyLiked = !!data
  }

  return (
    <div>
      <LikeButton
        postId={postId}
        initiallyLiked={initiallyLiked}
        initialLikeCount={count ?? 0}
      />
    </div>
  )
}
