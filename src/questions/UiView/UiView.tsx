import { BookOpen, KeyRound, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useId, useState } from 'react';
import { Badge, Callout, cn, DifficultyBadge, IconButton, TabPanel, Tabs } from '../../ui';
import { Prose } from '../../ui/code';
import { confirmReveal, SolutionDisclosure, useDraft, useFirstVerdict, type ViewProps } from '../shared';
import { Requirements } from './Requirements';
import { Workspace, type Pane } from './Workspace';
import type { UiQuestion } from '../../content/types';

const PREVIEW_NOTE = {
  react: 'Preview: React 19 with Tailwind v4 (including tokens like bg-surface and text-text-muted); bare npm imports such as lucide-react load from esm.sh.',
  vanilla: 'Preview: your HTML document as-is. localStorage and IndexedDB reset when the preview reloads.',
};

export function UiView({ q, subject, onResult }: Readonly<ViewProps<UiQuestion>>) {
  const tabsId = useId();
  const { code, setCode, reset } = useDraft(`${subject}:${q.id}`, q.starter);
  const [left, setLeft] = useState<'problem' | 'solution'>('problem');
  const [pane, setPane] = useState<Pane>('code');
  const [briefOpen, setBriefOpen] = useState(true);
  const [done, setDone] = useState<Set<number>>(new Set());
  const [submitted, setSubmitted] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const verdict = useFirstVerdict(onResult);

  const toggle = (i: number) => setDone((cur) => new Set(cur.has(i) ? [...cur].filter((x) => x !== i) : [...cur, i]));

  const submit = () => {
    setSubmitted(true);
    verdict(true);
  };

  const unlocked = submitted || revealed;

  const revealSolution = () => {
    if (!confirmReveal(submitted)) return false;
    if (!submitted) verdict(false);
    setRevealed(true);
    setBriefOpen(true);
    setLeft('solution');
    setPane('reference');
    return true;
  };

  return (
    <div className={cn('grid gap-5', briefOpen && 'xl:grid-cols-3')}>
      {/* Hidden, not unmounted, so ticked requirements survive a toggle. */}
      <div hidden={!briefOpen} className="min-w-0 space-y-4">
        <Tabs
          id={tabsId}
          label="Brief"
          value={left}
          onChange={setLeft}
          tabs={[
            { value: 'problem', label: 'Problem', icon: <BookOpen size={14} /> },
            ...(q.solution && unlocked ? [{ value: 'solution' as const, label: 'Solution', icon: <KeyRound size={14} /> }] : []),
          ]}
          trailing={
            <>
              <Badge tone="brand">{q.framework === 'react' ? 'React + TS' : 'HTML / CSS / JS'}</Badge>
              <DifficultyBadge difficulty={q.difficulty} />
            </>
          }
        />
        <TabPanel id={tabsId} value={left} className="space-y-4">
          {left === 'solution' && q.solution ? (
            <Callout tone="neutral">
              The reference implementation is open on the right under <strong>Reference</strong>. Compare structure, state shape and accessibility, not only
              looks.
            </Callout>
          ) : (
            <>
              <Prose text={q.prompt} />
              <p className="text-xs text-text-muted">{PREVIEW_NOTE[q.framework]}</p>
              <Requirements items={q.requirements} done={done} onToggle={toggle} submitted={submitted} onSubmit={submit} />
              {!unlocked && <SolutionDisclosure code={q.solution} lang={q.framework === 'react' ? 'tsx' : 'markup'} onOpen={revealSolution} />}
            </>
          )}
        </TabPanel>
      </div>

      <div className={cn('min-w-0 xl:sticky xl:top-4 xl:self-start', briefOpen && 'xl:col-span-2')}>
        <Workspace
          q={q}
          subject={subject}
          code={code}
          onCode={setCode}
          pane={pane}
          onPane={setPane}
          showReference={unlocked && !!q.solution}
          canReveal={!!q.solution && !unlocked}
          onReveal={revealSolution}
          onReset={() => reset('Discard your code and start from the starter?')}
          leading={<BriefToggle open={briefOpen} onToggle={() => setBriefOpen((o) => !o)} />}
        />
      </div>
    </div>
  );
}

/** Collapses the problem column so the workspace gets the full width. */
function BriefToggle({ open, onToggle }: Readonly<{ open: boolean; onToggle: () => void }>) {
  return (
    <IconButton label={open ? 'Hide problem' : 'Show problem'} onClick={onToggle} className="border-0 p-1.5">
      {open ? <PanelLeftClose size={16} aria-hidden /> : <PanelLeftOpen size={16} aria-hidden />}
    </IconButton>
  );
}
