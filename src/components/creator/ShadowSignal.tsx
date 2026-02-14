import './ShadowSignal.css'
import { SIGNAL_COPY } from '@/lib/creatorSignals'


export function ShadowSignal({
  signal,
}: {
  signal: string
}) {
  return (
    <p className="creator-signal">
      {SIGNAL_COPY[signal] ??
        'This performed within your usual range.'}
    </p>
  )
}
