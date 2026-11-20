'use client';
import { ALL, subjectHref, SUBJECTS } from '@fe-grind/content/registry';
import { Card, inline, SubjectIcon } from '@fe-grind/ui';
import Link from 'next/link';
import type { Attempt } from '../../state/progress';
import type { SubjectMeta } from '@fe-grind/content/types';

/** The three marks of the subject strip; the legend draws the same squares. */
const MARKS = {
  solved: 'bg-brand',
  missed: 'bg-error',
  untried: 'bg-line',
} as const;

function Mark({ kind }: Readonly<{ kind: keyof typeof MARKS }>) {
  return <span aria-hidden className={`inline-block size-2.5 shrink-0 rounded-[2px] ${MARKS[kind]}`} />;
}

/** One subject as a row of a coverage report: solved and missed share one bar, the rest is untried track. */
function SubjectRow({ subject, progress }: Readonly<{ subject: SubjectMeta; progress: Record<string, Attempt> }>) {
  const items = ALL.filter((e) => e.subject.slug === subject.slug);
  const solved = items.filter((e) => progress[e.key]?.status === 'correct').length;
  const missed = items.filter((e) => progress[e.key]?.status === 'wrong').length;
  const pct = (n: number) => `${(n / items.length) * 100}%`;
  return (
    <li>
      <Link
        href={subjectHref(subject.slug)}
        className="grid grid-cols-[20px_1fr_auto] items-center gap-x-3 gap-y-2 px-4 py-3 transition-colors hover:bg-surface-muted sm:px-5 md:grid-cols-[20px_minmax(0,22rem)_1fr_5.5rem] md:gap-x-5"
      >
        <SubjectIcon name={subject.icon} size={16} aria-hidden className="text-text-muted" />
        <div className="min-w-0">
          <h3 className="text-sm font-medium">{subject.title}</h3>
          <p className="hidden truncate text-xs text-text-muted md:block">{inline(subject.blurb)}</p>
        </div>
        <p className="text-right text-sm tabular-nums md:order-last">
          {solved}
          <span className="text-text-muted"> / {items.length}</span>
        </p>
        <div className="col-span-3 col-start-1 md:col-span-1 md:col-start-auto">
          {/* A native <progress> for assistive tech; the segments below are its visual twin. */}
          <progress
            className="sr-only"
            aria-label={`${subject.title} progress`}
            value={solved}
            max={items.length}
            aria-valuetext={`${solved} solved, ${missed} missed, ${items.length - solved - missed} untried`}
          />
          <div aria-hidden className="flex h-2 overflow-hidden rounded-[2px] bg-line">
            <span className="bg-brand" style={{ width: pct(solved) }} />
            <span className="bg-error" style={{ width: pct(missed) }} />
          </div>
        </div>
      </Link>
    </li>
  );
}

/** Every subject as one coverage report: a legend of the marks, then a row per subject. */
export function SubjectStrip({ progress, labelledBy }: Readonly<{ progress: Record<string, Attempt>; labelledBy: string }>) {
  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b border-line px-4 py-3 text-xs text-text-muted sm:px-5">
        <span className="tabular-nums">
          {SUBJECTS.length} subjects · {ALL.length} questions
        </span>
        <span className="flex gap-4">
          {(['solved', 'missed', 'untried'] as const).map((k) => (
            <span key={k} className="flex items-center gap-1.5">
              <Mark kind={k} /> {k[0].toUpperCase() + k.slice(1)}
            </span>
          ))}
        </span>
      </div>
      <ul className="divide-y divide-line" aria-labelledby={labelledBy}>
        {SUBJECTS.map((s) => (
          <SubjectRow key={s.slug} subject={s} progress={progress} />
        ))}
      </ul>
    </Card>
  );
}
