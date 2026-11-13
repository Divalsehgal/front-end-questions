import { ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../lib';
import { PaneResizer } from '../PaneResizer';

export type Log = { id: number; level: string; text: string };
const LEVEL_CLASS: Record<string, string> = { error: 'text-error', warn: 'text-warn' };

/** Collapsible log list under the preview, like a sandbox's console panel. */
export function ConsoleBar({ logs, label, onClear }: Readonly<{ logs: Log[]; label: string; onClear: () => void }>) {
  const [consoleOpen, setConsoleOpen] = useState(false);
  const [height, setHeight] = useState(160);
  const errors = logs.filter((l) => l.level === 'error').length;
  return (
    <div className="relative border-t border-line font-mono text-xs">
      {consoleOpen && <PaneResizer edge="top" size={height} min={48} reserve={120} label="Resize console" onResize={setHeight} />}
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
