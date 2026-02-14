Frozen Invariants — Reflection Echo

1) Echo must never auto-show.
Echo only reveals on explicit user action.

2) Echo must never pressure the user.
No urgency framing, countdowns, streaks, or loss aversion.
Reflection is voluntary and never rushed.

3) Echo must never compare the user to others.
No rankings, leaderboards, or relational metrics.
Reflection is private and not a performance.

# Reflection–Echo Invariants

This document defines frozen guarantees.
They are not features. They are contracts.

These invariants must always hold:

- Echo never auto-surfaces
- Echo reveals only on explicit user action
- Echo can always be hidden again
- No urgency language around reflection
- No comparison, ranking, or performance framing
- Silence is always a valid state
- Reflection is never used for pressure mechanics
- Reflection is private and not a performance

If implementation conflicts with this document,
the implementation is wrong.

Design defines meaning.
Code enforces boundaries.
UX protects dignity.

# Prompt–Echo System — Canonical Invariants

This document is the single source of truth.
Code, tests, and database comments reference this file.
They do not redefine its meaning.

These principles are frozen. Wording changes are semantic changes.

---

## Echo Visibility

- Echo never auto-surfaces.
- Echo reveals only on explicit user action.
- Echo can always be hidden again.
- Echo is collapsed by default.

## Language Constraints

- No urgency language.
- No countdowns, streaks, loss-aversion framing.
- No pressure to return, complete, or maintain momentum.

## Comparison Constraints

- Echo must never compare the user to others.
- No rankings, leaderboards, or relational metrics.
- Reflection is private and not a performance.

## Valid States

- Silence is a valid and complete state.
- Absence does not imply failure.
- Reflection is optional.
- The user owes the system nothing.

---

## Enforcement Layers

| Invariant | Enforced At |
| --------- | ----------- |
| Never auto-surface | UI + API |
| Explicit reveal only | UI |
| Always can hide | UI |
| No urgency language | Copy |
| No comparison framing | Copy + UI |
| Privacy | DB + RLS |
| Silence is valid | UX |

---

### Freeze Clause

If changing these feels tempting,
stop first.

Changes require explicit design review and documentation.
