import { Code2, Eye, KeyRound, MonitorPlay, RotateCcw } from 'lucide-react';
import { useId } from 'react';
import { Button, Card, TabPanel, Tabs } from '../../ui';
import { CodeEditor, LivePreview } from '../../ui/code';
import type { UiQuestion } from '../../content/types';

export type Pane = 'code' | 'preview' | 'reference';

/** Right-hand side of a machine-coding question: editor, live preview and (once unlocked) the reference. */
export function Workspace({
  q,
  subject,
  code,
  onCode,
  pane,
  onPane,
  showReference,
  canReveal,
  onReveal,
  onReset,
}: {
  q: UiQuestion;
  subject: string;
  code: string;
  onCode: (v: string) => void;
  pane: Pane;
  onPane: (p: Pane) => void;
  showReference: boolean;
  canReveal: boolean;
  onReveal: () => void;
  onReset: () => void;
}) {
  const tabsId = useId();
  const ext = q.framework === 'react' ? 'tsx' : 'html';
  return (
    <Card className="overflow-hidden">
      <div className="flex flex-wrap items-center gap-2 border-b border-line px-3 py-2">
        <Tabs
          id={tabsId}
          label="Workspace"
          value={pane}
          onChange={onPane}
          tabs={[
            { value: 'code', label: 'Code', icon: <Code2 size={14} /> },
            { value: 'preview', label: 'Preview', icon: <MonitorPlay size={14} /> },
            ...(showReference ? [{ value: 'reference' as const, label: 'Reference', icon: <KeyRound size={14} /> }] : []),
          ]}
        />
        <div className="ml-auto flex gap-1">
          {canReveal && (
            <Button variant="ghost" onClick={onReveal}>
              <Eye size={14} aria-hidden /> Solution
            </Button>
          )}
          <Button variant="ghost" onClick={onReset}>
            <RotateCcw size={14} aria-hidden /> Start fresh
          </Button>
        </div>
      </div>
      <TabPanel id={tabsId} value={pane}>
        {pane === 'code' && (
          <CodeEditor
            path={`file:///ui-${subject}-${q.id}.${ext}`}
            label={`Your code for ${q.title}`}
            value={code}
            onChange={onCode}
            onRun={() => onPane('preview')}
          />
        )}
        {pane === 'preview' && (
          <div className="h-[70vh]">
            <LivePreview framework={q.framework} code={code} title={`${q.title} preview`} />
          </div>
        )}
        {pane === 'reference' && q.solution && (
          <div className="grid h-[70vh] grid-rows-2">
            <CodeEditor path={`file:///ui-ref-${subject}-${q.id}.${ext}`} label="Reference solution" value={q.solution} readOnly className="min-h-0" />
            <div className="border-t border-line">
              <LivePreview framework={q.framework} code={q.solution} title={`${q.title} reference preview`} />
            </div>
          </div>
        )}
      </TabPanel>
    </Card>
  );
}
