'use client'

/**
 * ReflectionEcho Component — Invariant Stamp
 *
 * This file must never:
 * - auto-surface echo
 * - pressure the user
 * - compare users or rank them
 *
 * Silence is valid.
 * Protected by EchoContract.
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import { EchoContract } from '@/contracts/echo.contract'
import { EchoCopy } from '@/copy/echo.copy'
import { inertia } from '@/lib/inertia'
import { timeDistanceFromNow } from '@/lib/timeDistance'

import styles from './ReflectionEcho.module.css'

type ReflectionEchoData = {
  week_start: string
  body: string
}

export function ReflectionEcho({
  echo,
}: {
  echo: ReflectionEchoData | null
}) {
  // invariant default: collapsed
  const [revealed, setRevealed] = useState(
    !EchoContract.defaultCollapsed
  )

  // overwhelm soft-lock
  const [softLocked, setSoftLocked] = useState(false)

  // rapid toggle detection
  const [recentToggleCount, setRecentToggleCount] = useState(0)

  // invariant enforcement
  EchoContract.mustNotAutoSurface()

  /**
   * Silence handling
   * Absence is complete.
   */
  if (!echo) {
    return (
      <aside className={styles.echoContainer}>
        <div className={styles.echoEmpty}>
          <h3 className={styles.echoEmptyTitle}>
            {EchoCopy.emptyStateTitle}
          </h3>
          <p className={styles.echoEmptyDescription}>
            {EchoCopy.emptyStateDescription}
          </p>
        </div>
      </aside>
    )
  }

  const distanceText = timeDistanceFromNow(echo.week_start)

  // ─────────────────────────────
  // ⏳ Soft-lock trigger
  // ─────────────────────────────
  function triggerSoftLock() {
    setSoftLocked(true)

    const duration = 30000 + Math.random() * 90000

    setTimeout(() => {
      setSoftLocked(false)
      setRecentToggleCount(0)
    }, duration)
  }

  function handleToggle() {
    if (softLocked) return

    setRecentToggleCount((prev) => {
      const next = prev + 1

      if (next > 4) {
        triggerSoftLock()
        return 0
      }

      setTimeout(() => setRecentToggleCount(0), 5000)
      return next
    })

    if (!revealed && EchoContract.canReveal(true)) {
      setRevealed(true)
      return
    }

    if (revealed && EchoContract.canHide(true)) {
      setRevealed(false)
    }
  }

  return (
    <aside className={styles.echoContainer}>
      {/* Soft-lock state */}
      {softLocked && (
        <div className={styles.echoCooldown}>
          <p className={styles.echoCooldownText}>
            Let’s pause for a moment.
          </p>
        </div>
      )}

      <button
        type="button"
        className={styles.echoToggle}
        disabled={softLocked}
        onClick={handleToggle}
      >
        {revealed
          ? 'Hide earlier reflection'
          : 'Show something you wrote before'}
      </button>

      {/* User-triggered reveal only */}
      <AnimatePresence>
        {revealed && !softLocked && (
          <motion.div
            {...inertia.fadeUp}
            exit={{ opacity: 0 }}
            className={styles.echoContent}
          >
            <p className={styles.echoTimeDistance}>
              This reflection is {distanceText}
            </p>

            <blockquote className={styles.echoBody}>
              {echo.body}
            </blockquote>
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  )
}
