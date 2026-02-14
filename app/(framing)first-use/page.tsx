export default function FirstUseFraming() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-neutral-950 text-neutral-200 px-6">
      <div className="max-w-md w-full space-y-10 text-center">

        {/* breathing pulse */}
        <div className="mx-auto w-20 h-20 rounded-full bg-neutral-800 animate-[pulse_6s_ease-in-out_infinite]" />

        {/* framing copy */}
        <div className="space-y-4">
          <p className="text-sm opacity-80">
            Nothing is required from you here.
          </p>

          <p className="text-sm opacity-70">
            This is a place you can return to without performing,
            explaining, or finishing anything.
          </p>

          <p className="text-sm opacity-70">
            If you stop, that’s allowed.  
            If you leave, nothing is lost.
          </p>
        </div>

        {/* permission, not CTA */}
        <div>
          <a
            href="/reflection/new"
            className="text-sm opacity-60 hover:opacity-90 transition"
          >
            enter when ready
          </a>
        </div>

      </div>
    </main>
  )
}
