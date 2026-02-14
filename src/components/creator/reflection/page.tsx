import ReflectionEditor from '@/components/creator/ReflectionEditor'
import { ReflectionEcho } from '@/components/creator/ReflectionEcho'
import { getWeeklyPrompt } from '@/lib/creator/prompts'
import { getReflectionForWeek } from '@/lib/creator/reflections'
import { getReflectionEcho } from '@/lib/creator/reflectionEcho'

export default async function ReflectionPage() {
  const reflection = await getReflectionForWeek()

  if (!reflection) {
    return null
  }

  const prompt = getWeeklyPrompt(reflection.week_start)

  const echo = await getReflectionEcho(
    reflection.creator_id,
    reflection.week_start
  )

  return (
    <>
      <ReflectionEditor
        reflectionId={reflection.id}
        body={reflection.body}
        locked={Boolean(reflection.locked_at)}
        status={reflection.status}
        weekStart={reflection.week_start}
        prompt={prompt.text}
      />

      {echo && (
        <ReflectionEcho echo={echo} />

      )}
    </>
  )
}
