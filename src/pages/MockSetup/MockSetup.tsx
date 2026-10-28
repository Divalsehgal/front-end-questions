import { Timer } from 'lucide-react';
import { useId, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ALL, hrefOf, SUBJECTS } from '../../content/registry';
import { KIND_ORDER, KIND_META } from '../../questions/kinds';
import { useProgress } from '../../state/progress';
import { startSession } from '../../state/session';
import { Button, Card, Chips, Page, PageHeader, ToggleChips } from '../../ui';
import { pickRound } from './pickRound';
import type { Kind } from '../../content/types';

const SIZES = ['5', '10', '15', '20'] as const;
// Kinds that fit a timed round; machine coding is too long to mix in by default.
const QUICK: Kind[] = ['output', 'quiz', 'flashcard', 'order'];
const KIND_OPTIONS = KIND_ORDER.filter((k) => k !== 'code' && k !== 'ui').map((k) => ({ value: k, label: KIND_META[k].plural }));
const SUBJECT_OPTIONS = SUBJECTS.map((s) => ({ value: s.slug, label: s.title }));

export function MockSetup() {
  const id = useId();
  const progress = useProgress();
  const navigate = useNavigate();
  const [size, setSize] = useState<(typeof SIZES)[number]>('10');
  const [subjects, setSubjects] = useState(SUBJECTS.map((s) => s.slug));
  const [kinds, setKinds] = useState<Kind[]>(QUICK);
  const [withCode, setWithCode] = useState(false);

  const pool = ALL.filter((e) => subjects.includes(e.subject.slug) && kinds.includes(e.q.kind));

  const start = () => {
    const drills = withCode ? ALL.filter((e) => subjects.includes(e.subject.slug) && e.q.kind === 'code') : [];
    const picked = pickRound(pool, progress, Number(size), drills);
    if (!picked.length) return;
    startSession(
      'mock',
      picked.map((e) => e.key),
    );
    void navigate(hrefOf(picked[0].key));
  };

  return (
    <Page width="narrow">
      <PageHeader
        title="Mock round"
        description="A timed, mixed set like a real screening round. Questions you missed or haven't seen come first, and only your first answer counts."
      />
      <Card className="space-y-6 p-5">
        <div>
          <p id={`${id}-size`} className="mb-2 text-sm font-medium">
            Questions
          </p>
          <Chips labelledBy={`${id}-size`} value={size} onChange={setSize} options={SIZES.map((n) => ({ value: n, label: n }))} />
        </div>
        <div>
          <p id={`${id}-subjects`} className="mb-2 text-sm font-medium">
            Subjects
          </p>
          <ToggleChips labelledBy={`${id}-subjects`} options={SUBJECT_OPTIONS} selected={subjects} onChange={setSubjects} />
        </div>
        <div>
          <p id={`${id}-kinds`} className="mb-2 text-sm font-medium">
            Question types
          </p>
          <ToggleChips labelledBy={`${id}-kinds`} options={KIND_OPTIONS} selected={kinds} onChange={setKinds} />
        </div>
        <label className="flex items-center gap-3 text-sm">
          <input type="checkbox" checked={withCode} onChange={() => setWithCode(!withCode)} className="size-4 accent-brand" />
          <span>Finish with one coding drill</span>
        </label>
        <div className="flex items-center gap-3">
          <Button onClick={start} disabled={!pool.length && !withCode}>
            <Timer size={16} aria-hidden /> Start round
          </Button>
          <span className="text-xs text-text-muted" aria-live="polite">
            {pool.length} questions match
          </span>
        </div>
      </Card>
    </Page>
  );
}
