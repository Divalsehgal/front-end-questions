import { useEffect, useRef } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useFullEntry } from '../../content/loader';
import { ALL, getEntry, hrefOf, keyOf, subjectHref } from '../../content/registry';
import { KIND_META } from '../../questions/kinds';
import { QuestionView } from '../../questions/registry';
import { record, useProgress } from '../../state/progress';
import { endSession, recordInSession, useSession } from '../../state/session';
import { Badge, inline, Page, StatusDot } from '../../ui';
import { QuestionLoading } from './QuestionLoading';
import { QuestionNav } from './QuestionNav';
import { RelatedQuestions } from './RelatedQuestions';

export function QuestionPage() {
  const { subject, id } = useParams<{ subject: string; id: string }>();
  const key = keyOf(subject ?? '', id ?? '');
  const entry = getEntry(key);
  // The body (prompt, options, code…) is in the subject's chunk; the header renders without it.
  const full = useFullEntry(key);
  const progress = useProgress();
  const session = useSession();
  const navigate = useNavigate();
  const headingRef = useRef<HTMLHeadingElement>(null);

  // A new question is a new "page": start at the top and move focus to its title so
  // screen reader and keyboard users land on the question, not wherever focus was.
  useEffect(() => {
    window.scrollTo(0, 0);
    headingRef.current?.focus({ preventScroll: true });
  }, [key]);

  if (!entry) return <Navigate to="/" replace />;

  const inSession = session?.keys.includes(key) ? session : null;
  const order = inSession ? inSession.keys : ALL.filter((e) => e.subject.slug === entry.subject.slug).map((e) => e.key);
  const index = order.indexOf(key);
  const prev = order[index - 1];
  const next = order[index + 1];
  const kind = KIND_META[entry.q.kind];
  const KindIcon = kind.icon;

  const onResult = (correct: boolean) => {
    record(key, correct);
    recordInSession(key, correct);
  };

  let nextLabel = 'Done';
  if (next) nextLabel = 'Next';
  else if (inSession) nextLabel = 'Finish';

  const goNext = () => {
    if (next) void navigate(hrefOf(next));
    else if (inSession) void navigate('/session');
    else void navigate(subjectHref(entry.subject.slug));
  };

  return (
    <Page width="wide">
      <QuestionNav
        entry={entry}
        session={inSession}
        position={{ index, total: order.length }}
        hasPrev={!!prev}
        nextLabel={nextLabel}
        onPrev={() => {
          if (prev) void navigate(hrefOf(prev));
        }}
        onNext={goNext}
        onQuit={() => {
          endSession();
          void navigate(subjectHref(entry.subject.slug));
        }}
      />

      <header className="mb-5 flex items-start gap-3">
        <span className="mt-2.5">
          <StatusDot attempt={progress[key]} />
        </span>
        <div className="min-w-0">
          <p className="mb-1 flex items-center gap-2">
            <Badge tone="brand">
              <KindIcon size={12} aria-hidden /> {kind.label}
            </Badge>
            <span className="font-mono text-xs text-text-muted">{entry.q.id}</span>
          </p>
          <h1 ref={headingRef} tabIndex={-1} className="text-2xl font-semibold tracking-tight">
            {inline(entry.q.title)}
          </h1>
        </div>
      </header>

      {full ? <QuestionView key={key} q={full.q} subject={entry.subject.slug} onResult={onResult} /> : <QuestionLoading />}
      {!inSession && <RelatedQuestions entry={entry} />}
    </Page>
  );
}
