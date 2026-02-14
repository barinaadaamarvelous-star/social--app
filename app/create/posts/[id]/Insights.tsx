import { ShadowSignal } from '@/components/creator/ShadowSignal'

export default function Insights({
  signal,
}: {
  signal: string
}) {
  return (
    <section>
      <ShadowSignal signal={signal} />
    </section>
  )
}
