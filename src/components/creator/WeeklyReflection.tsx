export function WeeklyReflection({
  prompt,
  initialBody,
  locked,
}: {
  prompt: string
  initialBody?: string
  locked: boolean
}) {
  return (
    <section className="weekly-reflection">
      <p className="prompt">{prompt}</p>

      {locked ? (
        <div className="reflection-locked">
          {initialBody}
        </div>
      ) : (
        <textarea
          defaultValue={initialBody}
          placeholder="Write for yourself. This will lock in 48 hours."
        />
      )}

      <p className="privacy-note">
        Private. Never shared. Never scored.
      </p>
    </section>
  )
}
