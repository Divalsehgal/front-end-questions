'use client';
import traces from '@fe-grind/dsa/traces';
import { cn } from '@fe-grind/ui/lib';
import { useState } from 'react';
import { TraceTable } from './TraceTable';
import { YourCode } from './YourCode';
import type { Step } from '@fe-grind/dsa/tracer';

// Built by packages/dsa/scripts/traces.mjs: one traced reference run per exercise, values pre-formatted.
const CUSTOM = 'custom';
const ITEM = 'flex items-baseline gap-2.5 rounded-lg px-2.5 py-1.5 text-left text-sm';
const num = 'min-w-5 shrink-0 font-mono text-xs text-text-muted tabular-nums';

/** Variable tables for each exercise's reference solution, or your own pasted code. */
export function DsaDryRun() {
  const [id, setId] = useState(traces[0].id);
  const tr = traces.find((x) => x.id === id) ?? traces[0];

  const item = (key: string, n: string | number, title: string) => (
    <button
      key={key}
      type="button"
      aria-current={id === key ? 'true' : undefined}
      onClick={() => setId(key)}
      className={cn(ITEM, id === key ? 'bg-brand-soft font-semibold text-text-main' : 'text-text-muted hover:bg-surface-muted hover:text-text-main')}
    >
      <span className={num}>{n}</span>
      {title}
    </button>
  );

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-7 md:grid-cols-[250px_minmax(0,1fr)]">
      <nav
        aria-label="Exercises"
        className="flex max-h-56 flex-col gap-px overflow-auto rounded-xl border border-line p-1 md:sticky md:top-6 md:max-h-[calc(100dvh-3rem)] md:rounded-none md:border-0 md:p-0 md:pr-1"
      >
        {item(CUSTOM, '+', 'Your code')}
        {traces.map((x) => item(x.id, x.n, x.title))}
      </nav>

      {id === CUSTOM ? (
        <YourCode />
      ) : (
        <section key={tr.id} aria-labelledby="trace-title">
          <h2 id="trace-title" className="mb-3.5 flex items-baseline gap-2.5 text-xl font-semibold tracking-tight">
            <span className="font-mono text-base text-brand-strong">{tr.n}</span>
            {tr.title}
          </h2>
          <dl className="mb-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
            <dt className="text-text-muted">Input</dt>
            <dd className="font-mono break-words">{tr.input}</dd>
            <dt className="text-text-muted">Output</dt>
            <dd className="font-mono break-words">{tr.output}</dd>
          </dl>
          <TraceTable steps={tr.steps as Step[]} cols={tr.cols} />
          <details className="mt-4">
            <summary className="w-fit cursor-pointer text-sm text-text-muted hover:text-text-main">Code that was traced</summary>
            <pre className="mt-3 rounded-lg bg-code px-3.5 py-3 font-mono text-xs whitespace-pre-wrap">{tr.code}</pre>
          </details>
        </section>
      )}
    </div>
  );
}
