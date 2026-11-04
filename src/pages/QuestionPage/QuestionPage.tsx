import { useEffect, useRef } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useFullEntry } from '../../content/loader';
import { ALL, getEntry, hrefOf, keyOf, subjectHref } from '../../content/registry';
import { KIND_META } from '../../questions/kinds';
import { QuestionView } from '../../questions/registry';
import { AnswerDisclosure } from '../../questions/shared';
import { record, useProgress } from '../../state/progress';
import { endSession, recordInSession, useSession } from '../../state/session';
import { Badge, inline, Page, StatusDot } from '../../ui';
import { Prose } from '../../ui/code';
import { QuestionLoading } from './QuestionLoading';
import { QuestionNav } from './QuestionNav';
import { RelatedQuestions } from './RelatedQuestions';

const DEEP_DIVE_LABEL = 'Deep dive (read after you answer)';

/** Where "Next" goes: the next question, the session summary, or back to the subject. */
function nextStep(next: string | undefined, inSession: boolean, subject: string) {
  if (next) return { label: 'Next', href: hrefOf(next) };
  if (inSession) return { label: 'Finish', href: '/session' };
  return { label: 'Done', href: subjectHref(subject) };
}

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

  const step = nextStep(next, !!inSession, entry.subject.slug);

  return (
    <Page width="wide">
      <QuestionNav
        entry={entry}
        session={inSession}
        position={{ index, total: order.length }}
        prevHref={prev && hrefOf(prev)}
        nextHref={step.href}
        nextLabel={step.label}
        onQuit={() => {
          endSession();
          void navigate(subjectHref(entry.subject.slug));
        }}
      />

      <header className="mb-5">
        <p className="mb-1.5 flex items-center gap-3">
          <Badge tone="brand">
            <KindIcon size={12} aria-hidden /> {kind.label}
          </Badge>
          <StatusDot attempt={progress[key]} withLabel />
        </p>
        <h1 ref={headingRef} tabIndex={-1} className="text-2xl font-semibold tracking-tight">
          {inline(entry.q.title)}
        </h1>
      </header>

      {full ? <QuestionView key={key} q={full.q} subject={entry.subject.slug} onResult={onResult} /> : <QuestionLoading />}
      {full?.q.explanation && (
        <div className="mt-6">
          {/* Not a reveal: opening it records nothing, the label just asks people to answer first. */}
          <AnswerDisclosure label={DEEP_DIVE_LABEL} onOpen={() => true}>
            <Prose text={full.q.explanation} />
          </AnswerDisclosure>
        </div>
      )}
      {!inSession && <RelatedQuestions entry={entry} />}
    </Page>
  );
}
