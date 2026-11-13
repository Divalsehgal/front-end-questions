import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

type Mode = 'normal' | 'pop' | 'sequential' | 'concurrent';
type Bar = { id: string; progress: number }; // 0..1

const TICK_MS = 50;
const FILL_DURATION_MS = 2000;
const STEP = TICK_MS / FILL_DURATION_MS;

const MODES: { id: Mode; label: string }[] = [
  { id: 'normal', label: 'Normal' },
  { id: 'pop', label: 'Auto-pop' },
  { id: 'sequential', label: 'Sequential' },
  { id: 'concurrent', label: 'Concurrent (3)' },
];

/** Which bars may fill on this tick. */
function activeIndices(bars: Bar[], mode: Mode): number[] {
  const incomplete: number[] = [];
  for (let i = 0; i < bars.length; i++) {
    if (bars[i].progress < 1) incomplete.push(i);
  }
  switch (mode) {
    case 'sequential':
      return incomplete.slice(0, 1); // only the first unfinished bar
    case 'concurrent':
      return incomplete.slice(0, 3); // the first three unfinished bars
    default:
      return incomplete; // normal and auto-pop: every bar
  }
}

export default function ProgressBarChallenge() {
  const [bars, setBars] = useState<Bar[]>([]);
  const [mode, setMode] = useState<Mode>('normal');

  // Any incomplete bar will eventually fill in every mode.
  const isFilling = bars.some((b) => b.progress < 1);

  // One interval for all bars. It only restarts when the mode changes or when
  // filling starts/stops; each tick reads the latest bars via a functional update.
  useEffect(() => {
    if (!isFilling) return;
    const id = setInterval(() => {
      setBars((prev) => {
        const active = activeIndices(prev, mode);
        const next = prev.map((b, i) =>
          active.includes(i) ? { ...b, progress: Math.min(b.progress + STEP, 1) } : b
        );
        return mode === 'pop' ? next.filter((b) => b.progress < 1) : next;
      });
    }, TICK_MS);
    return () => clearInterval(id);
  }, [mode, isFilling]);

  const changeMode = (next: Mode) => {
    setMode(next);
    setBars([]);
  };

  const addBar = () => setBars((prev) => [...prev, { id: crypto.randomUUID(), progress: 0 }]);

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <div role="group" aria-label="Mode" className="flex flex-wrap gap-2 rounded-xl border border-border-subtle bg-muted p-1.5">
        {MODES.map((m) => (
          <button
            key={m.id}
            type="button"
            aria-pressed={mode === m.id}
            onClick={() => changeMode(m.id)}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-semibold transition-colors",
              mode === m.id
                ? "bg-surface text-brand-500 shadow-soft"
                : "text-text-muted hover:text-text-main"
            )}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-main">Progress bars</h2>
          <p className="text-sm text-text-muted">Mode: {mode}</p>
        </div>
        <button
          type="button"
          onClick={addBar}
          className="flex items-center gap-2 rounded-lg bg-brand-500 px-5 py-2.5 font-semibold text-white transition-colors hover:bg-brand-600"
        >
          <Plus size={18} /> Add
        </button>
      </div>

      <div className="min-h-[200px] space-y-3 rounded-2xl border border-border-subtle bg-surface p-6">
        {bars.length === 0 ? (
          <p className="py-16 text-center text-sm text-text-muted">No bars yet. Click Add.</p>
        ) : (
          bars.map((b, i) => {
            const pct = Math.round(b.progress * 100);
            return (
              <div
                key={b.id}
                role="progressbar"
                aria-label={`Bar ${i + 1}`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={pct}
                className="h-4 overflow-hidden rounded-full bg-muted"
              >
                <div
                  className="h-full origin-left bg-brand-500"
                  style={{ transform: `scaleX(${b.progress})` }}
                />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
