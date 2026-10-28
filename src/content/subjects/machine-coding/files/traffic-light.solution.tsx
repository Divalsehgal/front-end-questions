import { useEffect, useState } from 'react';

// A small state machine: each light knows how long it stays on and which light comes next.
const CONFIG = {
  red: { duration: 4000, next: 'green' },
  green: { duration: 3000, next: 'yellow' },
  yellow: { duration: 1000, next: 'red' },
} as const;

type Light = keyof typeof CONFIG;

const COLORS: Record<Light, string> = { red: 'bg-error-500', yellow: 'bg-warning-500', green: 'bg-success-500' };

export default function TrafficLight() {
  const [light, setLight] = useState<Light>('red');
  const [paused, setPaused] = useState(false);

  // One setTimeout per light, using THAT light's duration (setInterval can only use one delay).
  // The cleanup clears it when the light changes, on pause and on unmount.
  useEffect(() => {
    if (paused) return;
    const timer = setTimeout(() => setLight(CONFIG[light].next), CONFIG[light].duration);
    return () => clearTimeout(timer);
  }, [light, paused]);

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <div className="flex flex-col gap-3 rounded-2xl bg-text-main p-4">
        {(['red', 'yellow', 'green'] as Light[]).map((color) => (
          <span key={color} className={`size-16 rounded-full ${COLORS[color]} ${color === light ? 'opacity-100' : 'opacity-20'}`} />
        ))}
      </div>
      {/* Say the state in words too, not only with colour. */}
      <p aria-live="polite" className="font-semibold text-text-main capitalize">
        {light}
        {paused && ' (paused)'}
      </p>
      <button onClick={() => setPaused((p) => !p)} className="rounded-lg border border-border-subtle px-4 py-2 text-text-main">
        {paused ? 'Resume' : 'Pause'}
      </button>
    </div>
  );
}
