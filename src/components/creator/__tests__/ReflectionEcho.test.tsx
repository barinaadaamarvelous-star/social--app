/**
 * Reflection Echo — Test Header
 *
 * These tests exist only to verify that the system behavior does not violate
 * the frozen Prompt–Echo Minimal Guarantees.
 *
 * The guarantees themselves are not defined here.
 * They are frozen at the design layer and mirrored verbatim in:
 *  - README Frozen Principles Index
 *  - Database table comment on `creator_reflections`
 *
 * If the guarantees ever change, update the design document first.
 * Then mirror wording in the DB comment.
 * Then update these test references — not the guarantees themselves.
 *
 * Design decides meaning. Code enforces boundaries. UX protects dignity.
 */


/**
 * ============================================================================
 * TEST CONTRACT — REFLECTION ECHO UI
 * ============================================================================
 *
 * This test suite enforces behavior derived from the canonical design contract:
 *
 *   README.md →
 *   Frozen Principles →
 *   Prompt–Echo Reflection System
 *
 * The source of truth is the design document.
 * This file does NOT define product meaning.
 *
 * ----------------------------------------------------------------------------
 * WHAT THESE TESTS ASSERT
 * ----------------------------------------------------------------------------
 *
 * - Echo is collapsed by default.
 * - Echo is revealed only by explicit user action.
 * - Echo can be hidden again by the user.
 * - No urgency, comparison, or pressure language is present.
 * - Silence (no echo) is a valid and non-error state.
 *
 * ----------------------------------------------------------------------------
 * WHAT THESE TESTS DO NOT DECIDE
 * ----------------------------------------------------------------------------
 *
 * - Why echo exists.
 * - When echo should exist.
 * - Whether echo should exist at all.
 *
 * Those decisions live at the design layer.
 *
 * ----------------------------------------------------------------------------
 * CHANGE DISCIPLINE
 * ----------------------------------------------------------------------------
 *
 * If a test here fails because the design rules changed:
 * - Update the README contract first.
 * - Update this comment second.
 * - Only then update test expectations.
 *
 * Tests enforce boundaries.
 * Design defines meaning.
 *
 * ============================================================================
 */

/**
 * ReflectionEcho — Test Context
 *
 * These tests validate behavioral boundaries, not product meaning.
 *
 * Design authority lives in:
 *   "Prompt–Echo Pairing Rules — Design Contract"
 *
 * This test suite assumes:
 * - Echo is collapsed by default
 * - Reveal is user-controlled
 * - No urgency or evaluative language
 * - Silence and non-interaction are valid outcomes
 *
 * If a test here conflicts with the design contract,
 * the test is wrong — not the design.
 *
 * Philosophy is not re-litigated in code.
 * Code exists to protect it.
 */

import { render, screen } from '@testing-library/react'
import { ReflectionEcho } from '../ReflectionEcho'

describe('ReflectionEcho', () => {
  it('is collapsed by default', () => {
    render(
      <ReflectionEcho
        echo={{
          week_start: '2025-01-01',
          body: 'Old reflection text',
        }}
      />
    )

    // The body should NOT be visible initially
    expect(
      screen.queryByText('Old reflection text')
    ).toBeNull()

    // The reveal affordance should be present
    expect(
      screen.getByRole('button', {
        name: /show something you wrote before/i,
      })
    ).toBeInTheDocument()
  })
})
