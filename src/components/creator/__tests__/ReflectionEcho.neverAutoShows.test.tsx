/**
 * Invariant Test — Echo Never Auto-Shows
 *
 * This test guards a frozen constraint:
 * the echo must not surface by itself under any circumstances.
 *
 * It does not define product philosophy.
 * The authoritative guarantees live in the README Frozen Principles Index
 * and the database comment on `creator_reflections`.
 *
 * If design rules change, update the design documents first —
 * not this test.
 */

import { render, screen } from "@testing-library/react"
import { ReflectionEcho } from "../ReflectionEcho"

describe("ReflectionEcho — invariant: never auto-shows", () => {
  it("does not render echo content by default, without any user action", () => {
    render(
      <ReflectionEcho
        echo={{
          week_start: "2024-01-01",
          body: "example",
        }}
      />
    )

    // echo content must not be present automatically
    // absence is the invariant; no text assumptions
    const echoContent = screen.queryByTestId("reflection-echo-content")
    expect(echoContent).toBeNull()
  })
})
