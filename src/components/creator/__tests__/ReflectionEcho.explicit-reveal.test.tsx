/**
 * Echo Invariant Test — Explicit User Reveal Required
 *
 * This test does NOT define product behavior.
 * It enforces one frozen constraint:
 *
 * Echo never auto-surfaces.
 * Echo appears ONLY after an explicit user action.
 *
 * If design rules change, update the README contract,
 * not this test. This test follows the contract.
 */

import { render, screen, fireEvent } from '@testing-library/react'
import { ReflectionEcho } from '../ReflectionEcho'

const sampleEcho = {
  week_start: '2025-01-01',
  body: 'Example prior reflection',
}

describe('ReflectionEcho — explicit reveal only', () => {
  it('does not show echo content on load', () => {
    render(<ReflectionEcho echo={sampleEcho} />)

    // echo content must NOT exist initially
    const content = screen.queryByTestId('reflection-echo-content')
    expect(content).toBeNull()
  })

  it('shows echo content only after explicit user action', () => {
    render(<ReflectionEcho echo={sampleEcho} />)

    const toggle = screen.getByRole('button')

    fireEvent.click(toggle)

    const content = screen.getByTestId('reflection-echo-content')
    expect(content).toBeInTheDocument()
  })
})
