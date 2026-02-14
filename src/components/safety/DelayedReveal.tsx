import { useState, useEffect } from "react";

interface DelayedRevealProps {
  children: React.ReactNode;
  delayMs?: number; // optional, defaults to 10 seconds
}

export default function DelayedReveal({
  children,
  delayMs = 10000,
}: DelayedRevealProps) {
  const [requestedReveal, setRequestedReveal] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [remainingTime, setRemainingTime] = useState(delayMs / 1000);

  useEffect(() => {
    if (!requestedReveal) return;

    if (remainingTime <= 0) {
      setRevealed(true);
      return;
    }

    const timer = setTimeout(() => {
      setRemainingTime((t) => t - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [requestedReveal, remainingTime]);

  if (!requestedReveal) {
    return (
      <div className="space-y-2">
        <p className="text-sm text-neutral-400">
          This may feel different with time.
        </p>

        <button
          onClick={() => setRequestedReveal(true)}
          className="rounded-xl px-3 py-2 border border-neutral-600 text-sm"
        >
          Open when ready
        </button>
      </div>
    );
  }

  if (!revealed) {
    return (
      <div className="space-y-2">
        <p className="text-sm text-neutral-400">
          Preparing content…
        </p>

        <p className="text-xs text-neutral-500">
          You can close this at any time.
        </p>

        <p className="text-xs text-neutral-500">
          Opening in {remainingTime}s
        </p>
      </div>
    );
  }

  // Content revealed – arrives gently
  return (
    <div className="transition-all duration-700 ease-out">
      {children}
    </div>
  );
}
