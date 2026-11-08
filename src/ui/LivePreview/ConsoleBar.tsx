import { ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../lib';

export type Log = { id: number; level: string; text: string };
const LEVEL_CLASS: Record<string, string> = { error: 'text-error', warn: 'text-warn' };

/** Collapsible log list under the preview, like a sandbox's console panel. */
export function ConsoleBar({ logs, label, onClear }: Readonly<{ logs: Log[]; label: string; onClear: () => void }>) {
  const [consoleOpen, setConsoleOpen] = useState(false);
  const [height, setHeight] = useState(160);
  const errors = logs.filter((l) => l.level === 'error').length;
  return (
    <div className="relative border-t border-line font-mono text-xs">
      {consoleOpen && <ResizeHandle height={height} onResize={setHeight} />}
      <div className="flex items-center gap-2 px-3 py-1">
        <button
          type="button"
          aria-expanded={consoleOpen}
          onClick={() => setConsoleOpen((o) => !o)}
          className="flex items-center gap-1 text-text-muted hover:text-text-main"
        >
          {consoleOpen ? <ChevronDown size={14} aria-hidden /> : <ChevronUp size={14} aria-hidden />}
          Console ({logs.length})
          {errors > 0 && (
            <span className="text-error">
              {' '}
              · {errors} error{errors > 1 ? 's' : ''}
            </span>
          )}
        </button>
        <button
          type="button"
          onClick={onClear}
          disabled={logs.length === 0}
          className="ml-auto flex items-center gap-1 text-text-muted hover:text-text-main disabled:opacity-50"
        >
          <Trash2 size={14} aria-hidden /> Clear
        </button>
      </div>
      {consoleOpen && (
        <ol aria-label={label} style={{ height }} className="overflow-auto border-t border-line">
          {logs.length === 0 && <li className="px-3 py-1 text-text-muted">No logs yet.</li>}
          {logs.map((l) => (
            <li key={l.id} className={cn('border-b border-line/50 px-3 py-1 whitespace-pre-wrap', LEVEL_CLASS[l.level])}>
              {l.text}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

const MIN_CONSOLE = 48;
const KEY_STEP: Record<string, number> = { ArrowUp: 16, ArrowDown: -16 };

/** Drag (or arrow keys) to resize the console, like a sandbox's panel splitter. */
function ResizeHandle({ height, onResize }: Readonly<{ height: number; onResize: (h: number) => void }>) {
  const clamp = (h: number, el: HTMLElement) => {
    // Leave room for the preview bar, the console header and a sliver of preview.
    const box = el.parentElement?.parentElement?.clientHeight ?? 0;
    const max = box > 0 ? box - 120 : Infinity;
    onResize(Math.round(Math.max(MIN_CONSOLE, Math.min(h, max))));
  };
  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- window splitter (ARIA APG)
    <div
      role="separator"
      aria-orientation="horizontal"
      aria-label="Resize console"
      aria-valuenow={height}
      // A focusable separator is an interactive window splitter (ARIA APG), so it takes focus.
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
      tabIndex={0}
      title="Drag to resize the console"
      onPointerDown={(e) => {
        if (e.button !== 0) return;
        e.preventDefault();
        const el = e.currentTarget;
        const startY = e.clientY;
        // Capture keeps the moves coming even while the pointer is over the preview iframe.
        el.setPointerCapture(e.pointerId);
        const move = (ev: PointerEvent) => clamp(height + startY - ev.clientY, el);
        const up = () => {
          document.body.classList.remove('select-none', 'cursor-row-resize');
          el.removeEventListener('pointermove', move);
          el.removeEventListener('pointerup', up);
          el.removeEventListener('pointercancel', up);
        };
        document.body.classList.add('select-none', 'cursor-row-resize');
        el.addEventListener('pointermove', move);
        el.addEventListener('pointerup', up);
        el.addEventListener('pointercancel', up);
      }}
      onKeyDown={(e) => {
        const step = KEY_STEP[e.key];
        if (!step) return;
        e.preventDefault();
        clamp(height + step, e.currentTarget);
      }}
      className="absolute inset-x-0 -top-1 z-30 h-2 cursor-row-resize touch-none hover:bg-brand focus-visible:bg-brand focus-visible:outline-none"
    />
  );
}
