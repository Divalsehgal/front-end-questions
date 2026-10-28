import { BookOpen, FileCode2, KeyRound } from 'lucide-react';
import { useId, useRef, useState } from 'react';
import { resetCodeSplit, setCodeSplit, SPLIT_MAX, SPLIT_MIN, useCodeSplit } from '../../state/split';
import { Callout, Card, DifficultyBadge, SplitPane, TabPanel, Tabs, type TabItem } from '../../ui';
import { CodeBlock, CodeEditor, Prose } from '../../ui/code';
import { confirmReveal, SolutionDisclosure, useDraft, useFirstVerdict, type ViewProps } from '../shared';
import { EditorToolbar } from './EditorToolbar';
import { TestResults } from './TestResults';
import { TypeResults } from './TypeResults';
import { useCodeRun } from './useCodeRun';
import type { CodeQuestion } from '../../content/types';

type Tab = 'problem' | 'tests' | 'solution';

const drillTabs = (typeOnly: boolean, withSolution: boolean): TabItem<Tab>[] => [
  { value: 'problem', label: 'Problem', icon: <BookOpen size={14} /> },
  { value: 'tests', label: typeOnly ? 'Type tests' : 'Tests', icon: <FileCode2 size={14} /> },
  ...(withSolution ? [{ value: 'solution' as const, label: 'Solution', icon: <KeyRound size={14} /> }] : []),
];

export function CodeView({ q, subject, onResult }: Readonly<ViewProps<CodeQuestion>>) {
  const tabsId = useId();
  const { code, setCode, reset } = useDraft(`${subject}:${q.id}`, q.starter);
  const [tab, setTab] = useState<Tab>('problem');
  const [solved, setSolved] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);
  const verdict = useFirstVerdict(onResult);
  const split = useCodeSplit();

  const runner = useCodeRun(
    q,
    code,
    () => {
      setSolved(true);
      verdict(true);
    },
    () => {
      setTab('problem');
      // On narrow screens results sit above the editor; bring them into view.
      requestAnimationFrame(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }));
    },
  );

  const revealSolution = () => {
    if (!confirmReveal(solved)) return false;
    if (!solved) verdict(false);
    setRevealed(true);
    setTab('solution');
    return true;
  };

  const canReveal = !!q.solution && !solved && !revealed;
  const tabs = drillTabs(runner.typeOnly, !!q.solution && (solved || revealed));

  return (
    <SplitPane
      label="Resize problem and editor"
      value={split}
      min={SPLIT_MIN}
      max={SPLIT_MAX}
      onChange={setCodeSplit}
      onReset={resetCodeSplit}
      left={
        <div className="min-w-0 space-y-4">
          <Tabs id={tabsId} label="Drill" value={tab} onChange={setTab} tabs={tabs} trailing={<DifficultyBadge difficulty={q.difficulty} />} />
          <TabPanel id={tabsId} value={tab} className="space-y-4">
            {tab === 'tests' && <CodeBlock code={q.tests ?? q.typeTests ?? ''} />}
            {tab === 'solution' && q.solution && (
              <>
                <Callout tone="neutral">Compare approaches, not just output: naming, edge cases, and complexity are what interviewers listen for.</Callout>
                <CodeBlock code={q.solution} />
              </>
            )}
            {tab === 'problem' && (
              <>
                <Prose text={q.prompt} />
                {canReveal && <SolutionDisclosure code={q.solution} onOpen={revealSolution} />}
                <div ref={resultsRef} className="scroll-mt-4 space-y-4">
                  {runner.run && <TestResults run={runner.run} onCompare={q.solution ? () => setTab('solution') : undefined} />}
                  {runner.types && <TypeResults types={runner.types} typeOnly={runner.typeOnly} />}
                </div>
              </>
            )}
          </TabPanel>
        </div>
      }
      right={
        <DrillEditor
          q={q}
          subject={subject}
          code={code}
          onCode={setCode}
          runner={runner}
          canReveal={canReveal}
          onReveal={revealSolution}
          onReset={() => reset('Discard your code and start from the empty starter?') && runner.clear()}
        />
      }
    />
  );
}

/** The right-hand side of a drill: run / check / reveal toolbar over the editor, pinned while the brief scrolls. */
function DrillEditor({
  q,
  subject,
  code,
  onCode,
  runner,
  canReveal,
  onReveal,
  onReset,
}: Readonly<{
  q: CodeQuestion;
  subject: string;
  code: string;
  onCode: (v: string) => void;
  runner: ReturnType<typeof useCodeRun>;
  canReveal: boolean;
  onReveal: () => void;
  onReset: () => void;
}>) {
  return (
    <div className="min-w-0 xl:sticky xl:top-4 xl:self-start">
      <Card className="overflow-hidden">
        <EditorToolbar
          running={runner.running}
          typeOnly={runner.typeOnly}
          hasTypeTests={!!q.typeTests}
          canReveal={canReveal}
          onRun={runner.runTests}
          onCheckTypes={runner.runTypes}
          onReveal={onReveal}
          onReset={onReset}
        />
        <CodeEditor
          path={`file:///solution-${subject}-${q.id}.ts`}
          label={`Your solution for ${q.title}`}
          value={code}
          onChange={onCode}
          onRun={runner.runTests}
          onMonaco={runner.setMonaco}
        />
      </Card>
    </div>
  );
}
