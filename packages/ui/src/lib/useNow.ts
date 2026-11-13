import { useEffect, useState } from 'react';

/**
 * The current time, read once on mount (render stays pure) and refreshed every
 * `intervalMs` when given. Use it instead of calling Date.now() while rendering.
 */
export function useNow(intervalMs?: number) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!intervalMs) return;
    const t = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(t);
  }, [intervalMs]);
  return now;
}
