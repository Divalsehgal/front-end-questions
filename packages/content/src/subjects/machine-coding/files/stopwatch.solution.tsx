import { useState, useEffect, useRef } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Play, Pause, RotateCcw, Flag } from "lucide-react";

const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

const pad = (n: number) => n.toString().padStart(2, "0");

function formatTime(ms: number) {
  const min = Math.floor(ms / 60000);
  const sec = Math.floor((ms % 60000) / 1000);
  const cs = Math.floor((ms % 1000) / 10);
  return { min: pad(min), sec: pad(sec), cs: pad(cs) };
}

export default function Timer() {
  const [time, setTime] = useState(0); // elapsed ms
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  // Wall-clock moment the current run "started", adjusted for time already elapsed.
  const startRef = useRef(0);

  // The interval lives only while running; cleanup clears it on pause and unmount.
  useEffect(() => {
    if (!isRunning) return;
    const id = setInterval(() => setTime(Date.now() - startRef.current), 10);
    return () => clearInterval(id);
  }, [isRunning]);

  const start = () => {
    // Resume from the paused time by back-dating the start.
    startRef.current = Date.now() - time;
    setIsRunning(true);
  };

  const pause = () => {
    setTime(Date.now() - startRef.current);
    setIsRunning(false);
  };

  const reset = () => {
    setIsRunning(false);
    setTime(0);
    setLaps([]);
  };

  const lap = () => {
    const now = isRunning ? Date.now() - startRef.current : time;
    setLaps((prev) => [now, ...prev]);
  };

  const t = formatTime(time);

  return (
    <div className="mx-auto max-w-md space-y-6 p-6">
      <h2 className="text-2xl font-bold text-text-main">Stopwatch</h2>

      <div className="rounded-2xl border border-border-subtle bg-surface p-8 text-center">
        <div className="flex items-end justify-center font-mono tabular-nums" role="timer" aria-label="Elapsed time">
          <Unit value={t.min} label="min" />
          <span className="mx-1 pb-6 text-5xl text-text-muted">:</span>
          <Unit value={t.sec} label="sec" />
          <span className="mx-1 pb-6 text-3xl text-text-muted">.</span>
          <Unit value={t.cs} label="cs" small />
        </div>

        <div className="mt-6 flex justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            aria-label="Reset"
            className="rounded-lg border border-border-subtle bg-surface p-3 text-text-muted transition-colors hover:bg-muted"
          >
            <RotateCcw className="size-5" />
          </button>
          <button
            type="button"
            onClick={isRunning ? pause : start}
            className={cn(
              "flex items-center gap-2 rounded-lg px-6 py-3 font-semibold transition-colors",
              isRunning ? "bg-muted text-text-main hover:bg-muted/80" : "bg-brand-500 text-white hover:bg-brand-600"
            )}
          >
            {isRunning ? <Pause className="size-5" /> : <Play className="size-5" />}
            {isRunning ? "Pause" : time > 0 ? "Resume" : "Start"}
          </button>
          <button
            type="button"
            onClick={lap}
            disabled={time === 0 && !isRunning}
            className="flex items-center gap-2 rounded-lg border border-border-subtle bg-surface px-4 py-3 text-text-muted transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Flag className="size-5" />
            Lap
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-text-muted">Laps</h3>
        <div className="max-h-[260px] overflow-y-auto rounded-2xl border border-border-subtle bg-muted">
          {laps.length === 0 ? (
            <p className="p-8 text-center text-sm text-text-muted">Press Lap to record a time.</p>
          ) : (
            <ol className="divide-y divide-border-subtle">
              {laps.map((lapTime, idx) => {
                const lt = formatTime(lapTime);
                return (
                  <li key={laps.length - idx} className="flex justify-between px-4 py-3">
                    <span className="text-sm text-text-muted">Lap {laps.length - idx}</span>
                    <span className="font-mono text-text-main tabular-nums">
                      {lt.min}:{lt.sec}.{lt.cs}
                    </span>
                  </li>
                );
              })}
            </ol>
          )}
        </div>
      </div>
    </div>
  );
}

function Unit({ value, label, small }: { value: string; label: string; small?: boolean }) {
  return (
    <div className="flex flex-col items-center">
      <span className={cn("leading-none text-text-main", small ? "text-4xl text-brand-500" : "text-6xl")}>
        {value}
      </span>
      <span className="mt-2 text-xs text-text-muted">{label}</span>
    </div>
  );
}
