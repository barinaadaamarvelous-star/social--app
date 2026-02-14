import ReflectionEditor from '@/components/creator/ReflectionEditor'
import { getWeeklyPrompt } from '@/lib/creator/weekly-prompt'
import { getReflectionForWeek } from '@/lib/creator/reflections'

export default async function ReflectionPage() {
  const reflection = await getReflectionForWeek()

  // 🛟 Safety guard — first-time creators, DB hiccups
  if (!reflection) {
    const weekStart = new Date().toISOString().slice(0, 10)

    return (
      <ReflectionEditor
        reflectionId={null}
        body={null}
        locked={false}
        status="empty"
        weekStart={weekStart}
        prompt={getWeeklyPrompt(weekStart)}
      />
    )
  }

  const prompt = getWeeklyPrompt(reflection.week_start)

  return (
    <ReflectionEditor
      reflectionId={reflection.id}
      body={reflection.body}
      locked={Boolean(reflection.locked_at)}
      status={reflection.status}
      weekStart={reflection.week_start}
      prompt={prompt}
    />
  )
}
