export type CreatorReflection = {
  id: string
  creator_id: string
  week_start: string
  body: string | null
  status: 'empty' | 'written' | 'skipped'
  locked_at: string | null
  created_at: string
}
