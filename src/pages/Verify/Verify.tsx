// Dev-only content health check (open /verify while running `npm run dev`).
// Runs the same machinery the app uses, so a green run means every question works.
import { Check, Loader2, Play, X } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { fullEntry, loadAllSubjects } from '../../content/loader';
import { ALL, hrefOf, SUBJECTS, type Entry, type FullEntry } from '../../content/registry';
import { KIND_META } from '../../questions/kinds';
import { Button, Card, Chips, List, Page, PageHeader } from '../../ui';
import { verify, type CheckResult } from './checks';

/** Runs `check` over `entries` a few at a time (each check may spin up a worker), reporting as each finishes. */
export async function runPool<E extends { key: string }>(
  entries: E[],
  check: (e: E) => Promise<CheckResult>,
  onResult: (r: CheckResult) => void,
  concurrency = 4,
) {
  const queue = [...entries];
  const worker = async () => {
    for (let e = queue.shift(); e; e = queue.shift()) {
      const entry = e;
      // Each worker runs its share one at a time on purpose (that is the concurrency limit). Sonar S9382 suppressed.
      onResult(await check(entry).catch((err) => ({ key: entry.key, ok: false, detail: String(err) }))); // NOSONAR
    }
  };
  await Promise.all(Array.from({ length: concurrency }, worker));
}

function ResultRow({ entry, result }: Readonly<{ entry: Entry; result: CheckResult }>) {
  const Icon = KIND_META[entry.q.kind].icon;
  return (
    <li className="flex items-start gap-3 px-5 py-3 text-sm">
      {result.ok ? (
        <Check size={16} role="img" aria-label="Pass" className="mt-0.5 shrink-0 text-success" />
      ) : (
        <X size={16} role="img" aria-label="Fail" className="mt-0.5 shrink-0 text-error" />
      )}
      <Icon size={14} aria-hidden className="mt-1 shrink-0 text-text-muted" />
      <div className="min-w-0">
        <Link to={hrefOf(entry.key)} className="font-mono text-xs hover:underline">
          {entry.key}
        </Link>
        <p className={`font-mono text-xs break-words ${result.ok ? 'text-text-muted' : 'text-error'}`}>{result.detail}</p>
      </div>
    </li>
  );
}

export default function Verify({ check = verify }: Readonly<{ check?: (e: FullEntry) => Promise<CheckResult> }>) {
  const [results, setResults] = useState<Record<string, CheckResult>>({});
  const [running, setRunning] = useState(false);
  const [filter, setFilter] = useState<'all' | 'failing'>('failing');
  const [subject, setSubject] = useState('all');
  const scope = ALL.filter((e) => subject === 'all' || e.subject.slug === subject);

  const runAll = async () => {
    setRunning(true);
    setResults({});
    // Checks need question bodies: load every subject in scope first.
    await loadAllSubjects();
    await runPool(
      scope.flatMap((e) => fullEntry(e.key) ?? []),
      check,
      (r) => setResults((cur) => ({ ...cur, [r.key]: r })),
    );
    setRunning(false);
  };

  const done = Object.values(results);
  const failing = done.filter((r) => !r.ok);
  const shown = scope.filter((e) => results[e.key] && (filter === 'all' || !results[e.key].ok));

  return (
    <Page>
      <PageHeader
        title="Content health check"
        description="Runs every output snippet, every reference solution against its tests (and type tests), checks starters fail, and lints quizzes, flashcards and order questions."
        actions={
          <Button onClick={runAll} disabled={running} aria-busy={running}>
            {running ? <Loader2 size={16} aria-hidden className="animate-spin" /> : <Play size={16} aria-hidden />} Run {scope.length}
          </Button>
        }
      />
      <div className="mb-4">
        <Chips
          label="Subject"
          value={subject}
          onChange={setSubject}
          options={[{ value: 'all', label: 'All subjects' }, ...SUBJECTS.map((x) => ({ value: x.slug, label: x.title }))]}
        />
      </div>
      <div className="mb-4 flex items-center gap-4 text-sm" data-testid="verify-summary">
        <output>
          {done.length} / {scope.length} checked · <span className="text-success">{done.length - failing.length} ok</span> ·{' '}
          <span className="text-error">{failing.length} failing</span>
        </output>
        <Chips
          label="Show"
          value={filter}
          onChange={setFilter}
          options={[
            { value: 'failing', label: 'Failing' },
            { value: 'all', label: 'All' },
          ]}
        />
      </div>
      <Card>
        <List label="Check results">
          {shown.map((e) => (
            <ResultRow key={e.key} entry={e} result={results[e.key]} />
          ))}
        </List>
      </Card>
    </Page>
  );
}
