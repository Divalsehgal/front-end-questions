import { Loader2, RefreshCw } from 'lucide-react';
import { useEffect, useRef, useState, type RefObject } from 'react';
import { IconButton } from '../IconButton';
import { cn } from '../lib';
import { ConsoleBar, type Log } from './ConsoleBar';

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

type Frame = { id: number; doc: string };
// Two fixed iframe slots; `active` is the one on screen, the other holds the next run while it loads.
// Swapping only flips visibility: moving or re-keying a loaded iframe in the DOM would reload it.
type Frames = { slots: [Frame | null, Frame | null]; active: 0 | 1 };
// The buffered frame is swapped in when it reports it rendered or errored, or after this long regardless.
const SWAP_TIMEOUT = 4000;
const SANDBOX = 'allow-scripts allow-modals allow-forms allow-popups';
const isPreviewMessage = (e: MessageEvent) => e.data?.source === 'fe-grind-preview' && !!e.source;
const EMPTY: Frames = { slots: [{ id: 0, doc: '' }, null], active: 0 };

async function buildDoc(framework: 'react' | 'vanilla', code: string) {
  // Loaded on demand: it pulls in sucrase for the React transform.
  const { reactDocument, vanillaDocument } = await import('./previewDocument');
  return framework === 'react' ? reactDocument(code) : vanillaDocument(code);
}

function withRun(f: Frames, run: Frame): Frames {
  const slots: Frames['slots'] = [...f.slots];
  const shown = slots[f.active];
  // Nothing on screen yet: load in place. Otherwise buffer in the other slot.
  if (!shown?.doc) slots[f.active] = { id: shown?.id ?? run.id, doc: run.doc };
  else slots[1 - f.active] = run;
  return { slots, active: f.active };
}

function promoted(f: Frames, id?: number): Frames {
  const next = f.slots[1 - f.active];
  if (!next || (id !== undefined && next.id !== id)) return f;
  const slots: Frames['slots'] = [...f.slots];
  slots[f.active] = null;
  return { slots, active: f.active === 0 ? 1 : 0 };
}

/**
 * Renders a machine-coding answer in a sandboxed iframe, with a console bar. Like online sandboxes,
 * a new run loads in a hidden frame behind the current one and is swapped in once it has rendered,
 * so editing never flashes a blank preview.
 */
export function LivePreview({ framework, code, title }: Readonly<{ framework: 'react' | 'vanilla'; code: string; title: string }>) {
  const [frames, setFrames] = useState<Frames>(EMPTY);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<Log[]>([]);
  const [stopped, setStopped] = useState<string | null>(null);
  const slotEls = useRef<(HTMLIFrameElement | null)[]>([null, null]);
  const active = useRef<0 | 1>(0);
  useEffect(() => {
    active.current = frames.active;
  }, [frames.active]);
  const ids = useRef(0); // unique ids for frames and log entries
  const lastDoc = useRef('');
  const baseHeap = useRef<number | null>(null);

  const run = (doc: string) => {
    lastDoc.current = doc;
    setLogs([]); // new run: new console, new memory baseline
    setStopped(null);
    baseHeap.current = null;
    const id = ++ids.current;
    setFrames((f) => withRun(f, { id, doc }));
  };

  // Debounce so typing doesn't rebuild on every keystroke; an unchanged build is skipped entirely.
  useEffect(() => {
    const t = setTimeout(async () => {
      try {
        const doc = await buildDoc(framework, code);
        setError(null);
        if (doc !== lastDoc.current) run(doc);
      } catch (e) {
        // Keep the last good render on screen; just show what failed to compile.
        setError(e instanceof Error ? e.message : String(e));
      }
    }, 500);
    return () => clearTimeout(t);
  }, [code, framework]);

  const pendingId = frames.slots[1 - frames.active]?.id;
  useEffect(() => {
    if (pendingId === undefined) return;
    const t = setTimeout(() => setFrames((f) => promoted(f, pendingId)), SWAP_TIMEOUT);
    return () => clearTimeout(t);
  }, [pendingId]);

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      // The frames are sandboxed without allow-same-origin, so their messages always come from origin "null".
      if (e.origin !== 'null' || !isPreviewMessage(e)) return;
      const shown = slotEls.current[active.current];
      const next = slotEls.current[1 - active.current];
      const fromNext = !!next && e.source === next.contentWindow;
      // While a run is buffered, the outgoing frame no longer speaks for the console.
      if (!fromNext && !(e.source === shown?.contentWindow && !next)) return;
      if (fromNext && (e.data.type === 'rendered' || e.data.type === 'error')) setFrames((f) => promoted(f));
      const { log, stop, clear } = readMessage(e.data.type, e.data.message, baseHeap);
      if (clear) setLogs([]);
      if (stop) {
        setStopped(stop);
        setFrames({ slots: [{ id: ++ids.current, doc: '' }, null], active: 0 }); // unload both frames
      }
      if (log) {
        const entry = { id: ++ids.current, ...log };
        setLogs((l) => [...l, entry].slice(-MAX_LOGS));
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  return (
    <div className="relative flex h-full min-h-0 flex-col bg-surface">
      {error && (
        <pre role="alert" className="absolute inset-x-0 top-8 z-20 bg-error-soft px-4 py-3 font-mono text-xs whitespace-pre-wrap text-error">
          {error}
        </pre>
      )}
      <PreviewBar title={title} busy={pendingId !== undefined} onReload={() => run(lastDoc.current)} />
      {stopped ? (
        <p role="alert" className="flex-1 p-4 text-sm text-error">
          {stopped}
        </p>
      ) : (
        <PreviewFrames frames={frames} title={title} slotEls={slotEls} />
      )}
      <ConsoleBar logs={logs} label={`${title} console`} onClear={() => setLogs([])} />
    </div>
  );
}

/** Both slots, always in the same DOM position: the active one on top, the other loading underneath it. */
function PreviewFrames({ frames, title, slotEls }: Readonly<{ frames: Frames; title: string; slotEls: RefObject<(HTMLIFrameElement | null)[]> }>) {
  return (
    <div className="relative min-h-0 flex-1">
      {frames.slots.map((frame, i) => {
        if (!frame) return null;
        const onScreen = i === frames.active;
        return (
          <iframe
            key={frame.id}
            ref={(el) => {
              slotEls.current[i] = el;
            }}
            title={onScreen ? title : `${title} (updating)`}
            aria-hidden={!onScreen}
            tabIndex={onScreen ? undefined : -1}
            srcDoc={frame.doc}
            sandbox={SANDBOX}
            // Underneath, not visibility:hidden: Chrome skips painting a frame that loads hidden.
            className={cn('absolute inset-0 size-full border-0', onScreen ? 'z-10' : 'pointer-events-none z-0')}
          />
        );
      })}
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
