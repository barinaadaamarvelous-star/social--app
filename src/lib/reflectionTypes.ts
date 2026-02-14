// src/lib/reflectionTypes.ts
export type ReflectionStatus =
  | 'empty'     // no reflection this week (default, neutral)
  | 'written'   // reflection exists
  | 'skipped'   // consciously skipped (optional)
