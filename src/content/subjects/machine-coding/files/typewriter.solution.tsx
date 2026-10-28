import { useState, useEffect, useRef } from "react";
import { RotateCcw, Play, Pause } from "lucide-react";

const SAMPLE_CODE = `async function fetchUser(id) {
  const res = await fetch(\`/api/users/\${id}\`);
  if (!res.ok) {
    throw new Error(\`Request failed: \${res.status}\`);
  }
  return res.json();
}`;

export default function TypeWriterEffect() {
  const [text, setText] = useState("");
  const [speed, setSpeed] = useState(40); // ms per character
  const [isTyping, setIsTyping] = useState(true);
  // The position survives pause/resume without triggering renders.
  const indexRef = useRef(0);

  const isDone = text.length === SAMPLE_CODE.length;

  useEffect(() => {
    if (!isTyping) return;
    const id = setInterval(() => {
      if (indexRef.current >= SAMPLE_CODE.length) {
        setIsTyping(false);
        return;
      }
      indexRef.current += 1;
      setText(SAMPLE_CODE.slice(0, indexRef.current));
    }, speed);
    // Cleared on pause, on speed change and on unmount.
    return () => clearInterval(id);
  }, [isTyping, speed]);

  const reset = () => {
    indexRef.current = 0;
    setText("");
    setIsTyping(true);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <style>{`@keyframes tw-blink { 50% { opacity: 0 } }`}</style>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-text-main">Typewriter</h2>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-text-muted">
            Speed
            <input
              type="range"
              min={10}
              max={150}
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="w-24 accent-brand-500"
            />
            <span className="w-12 tabular-nums">{speed}ms</span>
          </label>
          <button
            type="button"
            onClick={() => setIsTyping((t) => !t)}
            disabled={isDone}
            className="flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-600 disabled:opacity-40"
          >
            {isTyping ? <Pause className="size-4" /> : <Play className="size-4" />}
            {isTyping ? "Pause" : "Resume"}
          </button>
          <button
            type="button"
            onClick={reset}
            aria-label="Reset"
            className="rounded-lg border border-border-subtle bg-muted p-2 transition-colors hover:bg-surface"
          >
            <RotateCcw className="size-4 text-text-muted" />
          </button>
        </div>
      </div>

      <pre className="min-h-[220px] overflow-x-auto rounded-2xl bg-slate-900 p-6 font-mono text-sm leading-relaxed whitespace-pre-wrap text-slate-100">
        <code>{text}</code>
        <span
          aria-hidden="true"
          className="ml-0.5 inline-block h-[1.1em] w-2 bg-slate-100 align-text-bottom"
          // Keep the cursor solid while typing; blink when idle.
          style={{ animation: isTyping ? "none" : "tw-blink 1s step-end infinite" }}
        />
      </pre>
    </div>
  );
}
