import { ChevronDown, ChevronUp, Loader2, RefreshCw, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState, type RefObject } from 'react';
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

type Frame = { id: number; doc: string };
type Frames = { shown: Frame; next: Frame | null };
// The buffered frame is swapped in when it reports it rendered or errored, or after this long regardless.
const SWAP_TIMEOUT = 4000;
const SANDBOX = 'allow-scripts allow-modals allow-forms allow-popups';

/**
 * Renders a machine-coding answer in a sandboxed iframe, with a console bar. Like online sandboxes,
 * a new run loads in a hidden frame behind the current one and is swapped in once it has rendered,
 * so editing never flashes a blank preview.
 */
export function LivePreview({ framework, code, title }: Readonly<{ framework: 'react' | 'vanilla'; code: string; title: string }>) {
  const [frames, setFrames] = useState<Frames>({ shown: { id: 0, doc: '' }, next: null });
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<Log[]>([]);
  const [stopped, setStopped] = useState<string | null>(null);
  const shownEl = useRef<HTMLIFrameElement>(null);
  const nextEl = useRef<HTMLIFrameElement>(null);
  const ids = useRef(0);
  const nextLogId = useRef(0);
  const lastDoc = useRef('');
  const baseHeap = useRef<number | null>(null);

  const run = (doc: string) => {
    lastDoc.current = doc;
    setLogs([]); // new run: new console, new memory baseline
    setStopped(null);
    baseHeap.current = null;
    const id = ++ids.current;
    // Nothing on screen yet: load in place. Otherwise buffer behind what is showing.
    setFrames((f) => (f.shown.doc ? { shown: f.shown, next: { id, doc } } : { shown: { id: f.shown.id, doc }, next: null }));
  };
  const promote = (id?: number) => setFrames((f) => (f.next && (id === undefined || f.next.id === id) ? { shown: f.next, next: null } : f));

  // Debounce so typing doesn't rebuild on every keystroke; an unchanged build is skipped entirely.
  useEffect(() => {
    const t = setTimeout(async () => {
      try {
        // Loaded on demand: it pulls in sucrase for the React transform.
        const { reactDocument, vanillaDocument } = await import('./previewDocument');
        const doc = framework === 'react' ? await reactDocument(code) : vanillaDocument(code);
        setError(null);
        if (doc !== lastDoc.current) run(doc);
      } catch (e) {
        // Keep the last good render on screen; just show what failed to compile.
        setError(e instanceof Error ? e.message : String(e));
      }
    }, 500);
    return () => clearTimeout(t);
  }, [code, framework]);

  const pendingId = frames.next?.id;
  useEffect(() => {
    if (pendingId === undefined) return;
    const t = setTimeout(() => promote(pendingId), SWAP_TIMEOUT);
    return () => clearTimeout(t);
  }, [pendingId]);

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.data?.source !== 'fe-grind-preview' || !e.source) return;
      const fromNext = !!nextEl.current && e.source === nextEl.current.contentWindow;
      const fromShown = !!shownEl.current && e.source === shownEl.current.contentWindow;
      // While a run is buffered, the outgoing frame no longer speaks for the console.
      if (!fromNext && !(fromShown && !nextEl.current)) return;
      if (fromNext && (e.data.type === 'rendered' || e.data.type === 'error')) promote();
      const { log, stop, clear } = readMessage(e.data.type, e.data.message, baseHeap);
      if (clear) setLogs([]);
      if (stop) {
        setStopped(stop);
        // Unload both frames; the next run (or reload) starts from an empty slot.
        setFrames({ shown: { id: ++ids.current, doc: '' }, next: null });
      }
      if (log) {
        const entry = { id: nextLogId.current++, ...log };
        setLogs((l) => [...l, entry].slice(-MAX_LOGS));
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  return (
    <div className="relative flex h-full min-h-0 flex-col bg-surface">
      {error && (
        <pre role="alert" className="absolute inset-x-0 top-8 z-10 bg-error-soft px-4 py-3 font-mono text-xs whitespace-pre-wrap text-error">
          {error}
        </pre>
      )}
      <PreviewBar title={title} busy={!!frames.next} onReload={() => run(lastDoc.current)} />
      {stopped ? (
        <p role="alert" className="flex-1 p-4 text-sm text-error">
          {stopped}
        </p>
      ) : (
        <PreviewFrames frames={frames} title={title} shownEl={shownEl} nextEl={nextEl} />
      )}
      <ConsoleBar logs={logs} label={`${title} console`} onClear={() => setLogs([])} />
    </div>
  );
}

/** The frame on screen, plus the next run loading invisibly behind it. */
function PreviewFrames({
  frames,
  title,
  shownEl,
  nextEl,
}: Readonly<{ frames: Frames; title: string; shownEl: RefObject<HTMLIFrameElement | null>; nextEl: RefObject<HTMLIFrameElement | null> }>) {
  return (
    <div className="relative min-h-0 flex-1">
      <iframe key={frames.shown.id} ref={shownEl} title={title} srcDoc={frames.shown.doc} sandbox={SANDBOX} className="absolute inset-0 size-full border-0" />
      {frames.next && (
        <iframe
          key={frames.next.id}
          ref={nextEl}
          title={`${title} (updating)`}
          aria-hidden
          tabIndex={-1}
          srcDoc={frames.next.doc}
          sandbox={SANDBOX}
          className="invisible absolute inset-0 size-full border-0"
        />
      )}
    </div>
  );
}

/** The preview's own browser-style bar: what is running, and a reload. */
function PreviewBar({ title, busy, onReload }: Readonly<{ title: string; busy: boolean; onReload: () => void }>) {
  return (
    <div className="flex items-center gap-2 border-b border-line bg-surface-muted px-3 py-1 text-xs text-text-muted">
      <span className="min-w-0 flex-1 truncate">{title}</span>
      {busy && <Loader2 size={12} aria-label="Updating" className="animate-spin" />}
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
