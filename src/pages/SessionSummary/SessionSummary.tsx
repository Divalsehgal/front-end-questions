import { Check, Minus, RotateCcw, Timer, X } from 'lucide-react';
import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { getEntry, hrefOf } from '../../content/registry';
import { endSession, startSession, useSession } from '../../state/session';
import { Button, Card, inline, List, Page, PageHeader, useNow } from '../../ui';

function ResultIcon({ result }: { result?: boolean }) {
  if (result === true) return <Check size={16} role="img" aria-label="Correct" className="shrink-0 text-success" />;
  if (result === false) return <X size={16} role="img" aria-label="Missed" className="shrink-0 text-error" />;
  return <Minus size={16} role="img" aria-label="Not answered" className="shrink-0 text-text-muted" />;
}

export function SessionSummary() {
  const session = useSession();
  const navigate = useNavigate();
  const now = useNow();
  // Where "New round" / "Back to dashboard" is heading: once the session is cleared this
  // page would otherwise redirect to the dashboard before the navigation lands.
  const [leavingTo, setLeavingTo] = useState<string | null>(null);
  if (!session) return <Navigate to={leavingTo ?? '/'} replace />;

  const right = Object.values(session.results).filter(Boolean).length;
  const missed = session.keys.filter((k) => session.results[k] === false);
  const mins = Math.max(0, Math.round((now - session.startedAt) / 60000));

  return (
    <Page width="narrow">
      <PageHeader title={session.kind === 'mock' ? 'Round complete' : 'Review complete'} />
      <div className="grid grid-cols-2 gap-3">
        <Card className="p-5">
          <p className="text-3xl font-semibold">
            {right} <span className="text-lg text-text-muted">/ {session.keys.length}</span>
          </p>
          <p className="text-sm text-text-muted">correct on the first try</p>
        </Card>
        <Card className="p-5">
          <p className="flex items-center gap-2 text-3xl font-semibold">
            <Timer aria-hidden className="text-brand-strong" /> {mins}m
          </p>
          <p className="text-sm text-text-muted">total time</p>
        </Card>
      </div>

      <Card className="mt-6">
        <List label="Questions in this round">
          {session.keys.map((k) => {
            const e = getEntry(k);
            if (!e) return null;
            return (
              <li key={k}>
                <Link to={hrefOf(k)} className="flex items-center gap-3 px-5 py-3 text-sm hover:bg-surface-muted">
                  <ResultIcon result={session.results[k]} />
                  <span className="min-w-0 flex-1 truncate">{inline(e.q.title)}</span>
                  <span className="shrink-0 text-xs text-text-muted">{e.subject.title}</span>
                </Link>
              </li>
            );
          })}
        </List>
      </Card>

      <div className="mt-6 flex flex-wrap gap-3">
        {missed.length > 0 && (
          <Button
            onClick={() => {
              startSession('review', missed);
              void navigate(hrefOf(missed[0]));
            }}
          >
            <RotateCcw size={16} aria-hidden /> Retry the {missed.length} I missed
          </Button>
        )}
        <Button
          variant="secondary"
          onClick={() => {
            const to = session.kind === 'mock' ? '/mock' : '/';
            setLeavingTo(to);
            endSession();
            void navigate(to);
          }}
        >
          {session.kind === 'mock' ? 'New round' : 'Back to dashboard'}
        </Button>
      </div>
    </Page>
  );
}
