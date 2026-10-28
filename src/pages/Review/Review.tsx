import { CalendarClock, PartyPopper, RotateCcw } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { hrefOf } from '../../content/registry';
import { KIND_META } from '../../questions/kinds';
import { resetProgress, useProgress } from '../../state/progress';
import { startSession } from '../../state/session';
import { Button, Card, EmptyState, inline, List, Page, PageHeader, SectionTitle, StatusDot, useNow } from '../../ui';
import { reviewSchedule } from './schedule';

export function Review() {
  const progress = useProgress();
  const navigate = useNavigate();
  const now = useNow(60_000);
  const { due, buckets } = reviewSchedule(progress, now);

  const start = () => {
    startSession(
      'review',
      due.map((e) => e.key),
    );
    void navigate(hrefOf(due[0].key));
  };

  return (
    <Page width="narrow">
      <PageHeader
        title="Review"
        description="Spaced repetition: a miss comes back right away; each correct answer pushes a question further out (1, 3, 7, 14, 30 days)."
      />

      {due.length ? (
        <Card className="overflow-hidden">
          <div className="flex items-center gap-4 px-5 py-4">
            <p className="font-semibold">{due.length} due now</p>
            <Button className="ml-auto" onClick={start}>
              <RotateCcw size={16} aria-hidden /> Start review
            </Button>
          </div>
          <div className="border-t border-line">
            <List label="Due questions">
              {due.map((e) => {
                const Icon = KIND_META[e.q.kind].icon;
                return (
                  <li key={e.key}>
                    <Link to={hrefOf(e.key)} className="flex items-center gap-3 px-5 py-3 text-sm hover:bg-surface-muted">
                      <StatusDot attempt={progress[e.key]} />
                      <Icon size={14} aria-hidden className="shrink-0 text-text-muted" />
                      <span className="min-w-0 flex-1 truncate">{inline(e.q.title)}</span>
                      <span className="shrink-0 text-xs text-text-muted">{e.subject.title}</span>
                    </Link>
                  </li>
                );
              })}
            </List>
          </div>
        </Card>
      ) : (
        <EmptyState icon={<PartyPopper />} title="All caught up">
          Nothing is due. Do new questions, or run a mock round.
        </EmptyState>
      )}

      <SectionTitle icon={<CalendarClock size={14} />}>Coming up</SectionTitle>
      <div className="grid grid-cols-3 gap-3">
        {buckets.map((b) => (
          <Card key={b.label} className="p-4">
            <p className="text-xl font-semibold">{b.n}</p>
            <p className="text-xs text-text-muted">{b.label}</p>
          </Card>
        ))}
      </div>

      <div className="mt-10 border-t border-line pt-6">
        <Button
          variant="ghost"
          onClick={() => {
            if (window.confirm('Reset ALL progress? This cannot be undone.')) resetProgress();
          }}
        >
          Reset all progress
        </Button>
      </div>
    </Page>
  );
}
