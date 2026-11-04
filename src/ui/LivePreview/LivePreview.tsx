import { ChevronDown, ChevronUp, RefreshCw, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { IconButton } from '../IconButton';
import { cn } from '../lib';

type Log = { id: number; level: string; text: string };
// shortcut: keeps only the latest logs so a runaway loop can't freeze the page; raise if users need more history.
const MAX_LOGS = 500;
// A preview whose heap grows this much past its first reading is almost certainly leaking
// (an ever-growing array or Map, timers or listeners never cleared); it gets unloaded before it takes the tab down.
const MEMORY_LIMIT = 300 * 1024 * 1024;
const leakMessage = (grew: number) =>
  `Preview stopped: its memory grew by ${Math.round(grew / 1024 / 1024)} MB, which usually means a leak (an array or Map that only grows, or timers and listeners that are never cleared). Fix it, then reload.`;
/** What a message from the preview means for the console and the memory watchdog. */
function readMessage(type: unknown, message: unknown, baseHeap: { current: number | null }) {
  if (type === 'console-clear') return { clear: true };
  if (type === 'error') return { log: { level: 'error', text: String(message) } };
  if (type === 'console') {
    const m = (message ?? {}) as { level?: unknown; text?: unknown };
    return { log: { level: String(m.level), text: String(m.text) } };
  }
  if (type === 'memory' && typeof message === 'number') {
    baseHeap.current ??= message;
    if (message - baseHeap.current > MEMORY_LIMIT) {
      const text = leakMessage(message - baseHeap.current);
      return { stop: text, log: { level: 'error', text } };
    }
  }
  return {};
}

const LEVEL_CLASS: Record<string, string> = { error: 'text-error', warn: 'text-warn' };

/** Renders a machine-coding answer in a sandboxed iframe, debounced while typing, with a console bar. */
export function LivePreview({ framework, code, title }: Readonly<{ framework: 'react' | 'vanilla'; code: string; title: string }>) {
  const [doc, setDoc] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<Log[]>([]);
  const frame = useRef<HTMLIFrameElement>(null);
  const nextId = useRef(0);
  // Bumping this remounts the iframe: a rerun without editing the code.
  const [runs, setRuns] = useState(0);
  const [stopped, setStopped] = useState<string | null>(null);
  const baseHeap = useRef<number | null>(null);
  const fresh = () => {
    setLogs([]);
    setStopped(null);
    baseHeap.current = null;
  };

  // Debounce so the preview doesn't reload on every keystroke.
  useEffect(() => {
    const t = setTimeout(async () => {
      try {
        // Loaded on demand: it pulls in sucrase for the React transform.
        const { reactDocument, vanillaDocument } = await import('./previewDocument');
        setDoc(framework === 'react' ? await reactDocument(code) : vanillaDocument(code));
        fresh(); // new run: new console, new memory baseline
        setError(null);
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    }, 500);
    return () => clearTimeout(t);
  }, [code, framework]);

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (!frame.current || e.source !== frame.current.contentWindow || e.data?.source !== 'fe-grind-preview') return;
      const { log, stop, clear } = readMessage(e.data.type, e.data.message, baseHeap);
      if (clear) setLogs([]);
      if (stop) setStopped(stop);
      if (log) {
        const entry = { id: nextId.current++, ...log };
        setLogs((l) => [...l, entry].slice(-MAX_LOGS));
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  return (
    <div className="relative flex h-full min-h-0 flex-col bg-surface">
      {error && (
        <pre role="alert" className="absolute inset-x-0 top-0 z-10 bg-error-soft px-4 py-3 font-mono text-xs whitespace-pre-wrap text-error">
          {error}
        </pre>
      )}
      <PreviewBar
        title={title}
        onReload={() => {
          fresh();
          setRuns((n) => n + 1);
        }}
      />
      {/* Dropping the iframe is what frees a leaking preview's memory. */}
      {stopped ? (
        <p role="alert" className="flex-1 p-4 text-sm text-error">
          {stopped}
        </p>
      ) : (
        <iframe
          key={runs}
          ref={frame}
          title={title}
          srcDoc={doc}
          sandbox="allow-scripts allow-modals allow-forms allow-popups"
          className="min-h-0 w-full flex-1 border-0"
        />
      )}
      <ConsoleBar logs={logs} label={`${title} console`} onClear={() => setLogs([])} />
    </div>
  );
}

/** The preview's own browser-style bar: what is running, and a reload. */
function PreviewBar({ title, onReload }: Readonly<{ title: string; onReload: () => void }>) {
  return (
    <div className="flex items-center gap-2 border-b border-line bg-surface-muted px-3 py-1 text-xs text-text-muted">
      <span className="min-w-0 flex-1 truncate">{title}</span>
      <IconButton label="Reload preview" className="border-0 bg-transparent p-1" onClick={onReload}>
        <RefreshCw size={14} aria-hidden />
      </IconButton>
    </div>
  );
}

/** Collapsible log list under the preview, like a sandbox's console panel. */
function ConsoleBar({ logs, label, onClear }: Readonly<{ logs: Log[]; label: string; onClear: () => void }>) {
  const [consoleOpen, setConsoleOpen] = useState(false);
  const errors = logs.filter((l) => l.level === 'error').length;
  return (
    <div className="border-t border-line font-mono text-xs">
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
        <ol aria-label={label} className="max-h-40 overflow-auto border-t border-line">
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
