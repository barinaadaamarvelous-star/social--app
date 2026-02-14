/**
 * Echo Invariant Test — Can Always Be Hidden
 *
 * This test enforces a frozen constraint:
 *
 * Echo must always be hideable by the user.
 *
 * It does not define UX, labels, timing, or animations.
 * If design rules change, update the README contract,
 * not this test. The test follows the contract.
 */

import { render, screen, fireEvent } from '@testing-library/react'
import { ReflectionEcho } from '../ReflectionEcho'

const sampleEcho = {
  week_start: '2025-01-01',
  body: 'Example earlier reflection',
}

describe('ReflectionEcho — echo can always be hidden', () => {
  it('allows user to hide echo after revealing it', () => {
    render(<ReflectionEcho echo={sampleEcho} />)

    const toggle = screen.getByRole('button')

    // reveal
    fireEvent.click(toggle)
    expect(screen.getByTestId('reflection-echo-content')).toBeInTheDocument()

    // hide
    fireEvent.click(toggle)
    expect(screen.queryByTestId('reflection-echo-content')).toBeNull()
  })
})
