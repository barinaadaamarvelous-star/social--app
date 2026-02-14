'use client'

import { useState, useRef, useEffect } from 'react'
import { toggleLike } from '@/lib/likes'
import './LikeButton.css'

type Props = {
  postId: string
  initiallyLiked: boolean
  initialLikeCount: number
}

const boosters = [
  '+1 felt this',
  'This resonated',
  'Someone noticed this',
  'You rarely like — this mattered',
  'This stood out to you',
]

// 🔁 G1 — cross-tab sync channel
const likeChannel =
  typeof window !== 'undefined'
    ? new BroadcastChannel('likes')
    : null

export default function LikeButton({
  postId,
  initiallyLiked,
  initialLikeCount,
}: Props) {
  const [liked, setLiked] = useState(initiallyLiked)
  const [count, setCount] = useState(initialLikeCount)

  // 🕒 silent cooldown (premium)
  const [cooldown, setCooldown] = useState(false)

  // 🔢 directional count tick
  const [tick, setTick] = useState<'up' | 'down' | null>(null)
  const prevCountRef = useRef(count)

  // ❤️ animations
  const [ignite, setIgnite] = useState(false)

  // ✨ micro effects
  const [particle, setParticle] = useState(false)
  const [booster, setBooster] = useState<string | null>(null)

  // 🧠 G3 — behavior memory
  const lastActionRef = useRef<number>(0)

  // 🔁 G1 — listen for cross-tab updates (silent)
  useEffect(() => {
    if (!likeChannel) return

    const handler = (event: MessageEvent) => {
      const { postId: incomingId, liked, count } = event.data
      if (incomingId !== postId) return

      setLiked(liked)
      setCount(count)
    }

    likeChannel.addEventListener('message', handler)
    return () =>
      likeChannel.removeEventListener('message', handler)
  }, [postId])

  // 🔢 detect count direction
  useEffect(() => {
    if (count > prevCountRef.current) setTick('up')
    else if (count < prevCountRef.current) setTick('down')

    prevCountRef.current = count
    const t = setTimeout(() => setTick(null), 180)
    return () => clearTimeout(t)
  }, [count])

  const handleClick = async () => {
    // 🤫 silent ignore during cooldown
    if (cooldown) return

    setCooldown(true)
    setTimeout(() => setCooldown(false), 500)

    const now = Date.now()
    const delta = now - lastActionRef.current
    lastActionRef.current = now

    const isFlipFlop = delta < 700
    const humanDelay = 60 + Math.random() * 90

    // snapshot
    const prevLiked = liked
    const prevCount = count

    // 🔮 optimistic UI (slightly humanized)
    setTimeout(() => {
      setLiked(!prevLiked)
      setCount(prevLiked ? prevCount - 1 : prevCount + 1)
    }, humanDelay)

    // ❤️ ignite only if not flip-flopping
    if (!prevLiked && !isFlipFlop) {
      setIgnite(true)
      setTimeout(() => setIgnite(false), 220)
    }

    try {
      await toggleLike(postId, prevLiked)

      // 🔁 broadcast success
      likeChannel?.postMessage({
        postId,
        liked: !prevLiked,
        count: prevLiked ? prevCount - 1 : prevCount + 1,
      })

      // • particle (LIKE only)
      if (!prevLiked) {
        setParticle(true)
        setTimeout(() => setParticle(false), 120)
      }

      // 🎁 identity-based booster
      if (!prevLiked && Math.random() < 0.5) {
        const isRareLiker = prevCount < 3

        setTimeout(() => {
          setBooster(
            isRareLiker
              ? 'You rarely like — this mattered'
              : boosters[Math.floor(Math.random() * boosters.length)]
          )
          setTimeout(() => setBooster(null), 1200)
        }, 400 + Math.random() * 300)
      }
    } catch {
      // 🤫 silent rollback
      setLiked(prevLiked)
      setCount(prevCount)
    }
  }

  return (
    <div className="like-wrapper">
      <button
        onClick={handleClick}
        className={`like-button ${liked ? 'liked' : ''} ${
          ignite ? 'ignite' : ''
        }`}
        style={{
          opacity: cooldown ? 0.6 : 1,
          pointerEvents: cooldown ? 'none' : 'auto',
        }}
      >
        <span className="heart">
          {liked ? '♥' : '♡'}
        </span>

        <span
          className={`count ${
            tick === 'up'
              ? 'count-up'
              : tick === 'down'
              ? 'count-down'
              : ''
          }`}
        >
          {count}
        </span>
      </button>

      {particle && <span className="like-particle" />}
      {booster && (
        <span className="like-booster">{booster}</span>
      )}
    </div>
  )
}
