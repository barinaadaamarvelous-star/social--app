import { CREATOR_PROMPTS } from '@/lib/creatorPrompts'
import './ReflectionPrompt.css'


export function ReflectionPrompt({
  signal,
}: {
  signal: string
}) {
  const prompt =
    CREATOR_PROMPTS[signal] ??
    CREATOR_PROMPTS.normal_engagement

  return (
    <div className="creator-reflection">
      <strong>{prompt.title}</strong>
      <p>{prompt.body}</p>
    </div>
  )
}
