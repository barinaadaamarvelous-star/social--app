'use client'

import { useState } from 'react'
import { toggleLike } from '@/lib/likes'

type Props = {
  postId: string
  initiallyLiked: boolean
}

export default function LikeButton({ postId, initiallyLiked }: Props) {
  const [liked, setLiked] = useState(initiallyLiked)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)


  const handleClick = async () => {
    setLoading(true)

    try {
      await toggleLike(postId, liked)
      setLiked(!liked)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
  <div className="like-wrapper">
    <button
      onClick={handleClick}
      disabled={loading}
      className={liked ? 'text-red-500' : 'text-gray-400'}
    >
      {liked ? '♥ Liked' : '♡ Like'}
    </button>

    {error && (
      <span className="like-error">
        Couldn’t save — tap again
      </span>
    )}
  </div>
)
}
