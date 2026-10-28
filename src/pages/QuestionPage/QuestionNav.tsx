import { ArrowLeft, ArrowRight, ChevronRight, Timer } from 'lucide-react';
import { Link } from 'react-router-dom';
import { subjectHref, type Entry } from '../../content/registry';
import { buttonClass, IconButton, inline, useNow } from '../../ui';
import type { Session } from '../../state/session';

function Elapsed({ since }: Readonly<{ since: number }>) {
  const now = useNow(1000);
  const s = Math.max(0, Math.floor((now - since) / 1000));
  return (
    <span className="font-mono tabular-nums" role="timer" aria-label="Elapsed time">
      {Math.floor(s / 60)}:{String(s % 60).padStart(2, '0')}
    </span>
  );
}

/** Breadcrumb (or the running session's position) plus previous / next controls. */
export function QuestionNav({
  entry,
  session,
  position,
  hasPrev,
  nextLabel,
  onPrev,
  onNext,
  onQuit,
}: Readonly<{
  entry: Entry;
  session: Session | null;
  position: { index: number; total: number };
  hasPrev: boolean;
  nextLabel: string;
  onPrev: () => void;
  onNext: () => void;
  onQuit: () => void;
}>) {
  const topicIndex = entry.topic.questions.findIndex((q) => q.id === entry.q.id);
  return (
    <div className="mb-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-text-muted">
      {session ? (
        <p className="flex items-center gap-2 rounded-full bg-brand-soft px-3 py-1 font-medium text-brand-strong">
          {session.kind === 'mock' ? 'Mock round' : 'Review'} · {position.index + 1} / {position.total}
          {session.kind === 'mock' && (
            <>
              <Timer size={14} aria-hidden /> <Elapsed since={session.startedAt} />
            </>
          )}
          <button type="button" onClick={onQuit} className="ml-1 text-xs underline underline-offset-2">
            Quit
          </button>
        </p>
      ) : (
        <nav className="min-w-0" aria-label="Breadcrumb">
          <ol className="flex min-w-0 items-center gap-1">
            <li>
              <Link to="/" className="underline-offset-2 hover:text-text-main hover:underline">
                Home
              </Link>
            </li>
            <li aria-hidden>
              <ChevronRight size={14} className="shrink-0" />
            </li>
            <li>
              <Link to={subjectHref(entry.subject.slug)} className="underline-offset-2 hover:text-text-main hover:underline">
                {entry.subject.title}
              </Link>
            </li>
            <li aria-hidden>
              <ChevronRight size={14} className="shrink-0" />
            </li>
            <li className="truncate">{inline(entry.topic.title)}</li>
            <li aria-hidden>
              <ChevronRight size={14} className="shrink-0" />
            </li>
            <li className="shrink-0" aria-current="page">
              {topicIndex + 1} / {entry.topic.questions.length}
            </li>
          </ol>
        </nav>
      )}
      <div className="ml-auto flex items-center gap-2">
        <IconButton label="Previous question" onClick={onPrev} disabled={!hasPrev}>
          <ArrowLeft size={16} aria-hidden />
        </IconButton>
        <button type="button" onClick={onNext} className={buttonClass('primary', 'md', 'px-3')}>
          {nextLabel} <ArrowRight size={16} aria-hidden />
        </button>
      </div>
    </div>
  );
}
