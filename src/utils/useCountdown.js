import { useEffect, useState } from "react";

/**
 * Seconds left until something may be retried (e.g. "Resend code").
 * Returns [secondsLeft, start(seconds)].
 */
export function useCountdown(initialSeconds = 0) {
  const [until, setUntil] = useState(() => Date.now() + initialSeconds * 1000);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (until <= Date.now()) return undefined;
    const t = setInterval(() => {
      const n = Date.now();
      setNow(n);
      if (n >= until) clearInterval(t);
    }, 250);
    return () => clearInterval(t);
  }, [until]);

  const left = Math.max(0, Math.ceil((until - now) / 1000));
  const start = (seconds) => {
    const n = Date.now();
    setNow(n);
    setUntil(n + Math.max(0, seconds) * 1000);
  };

  return [left, start];
}
