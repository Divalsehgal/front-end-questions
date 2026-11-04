import { Code2, Eye, KeyRound, MonitorPlay, RotateCcw } from 'lucide-react';
import { useId, useSyncExternalStore, type ReactNode } from 'react';
import { Button, Card, cn, TabPanel, Tabs, type TabItem } from '../../ui';
import { CodeEditor, LivePreview } from '../../ui/code';
import type { UiQuestion } from '../../content/types';

export type Pane = 'code' | 'preview' | 'reference';

/** Wide enough to show editor and preview side by side, like an online sandbox. */
const SPLIT_QUERY = '(min-width: 1280px)';
function subscribeSplit(onChange: () => void) {
  if (typeof matchMedia !== 'function') return () => undefined;
  const mq = matchMedia(SPLIT_QUERY);
  mq.addEventListener('change', onChange);
  return () => mq.removeEventListener('change', onChange);
}
const isSplit = () => typeof matchMedia === 'function' && matchMedia(SPLIT_QUERY).matches;

const paneTabs = (split: boolean, showReference: boolean): TabItem<Pane>[] => [
  { value: 'code', label: split ? 'Code + Preview' : 'Code', icon: <Code2 size={14} /> },
  ...(split ? [] : [{ value: 'preview' as const, label: 'Preview', icon: <MonitorPlay size={14} /> }]),
  ...(showReference ? [{ value: 'reference' as const, label: 'Reference', icon: <KeyRound size={14} /> }] : []),
];

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
  leading,
}: Readonly<{
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
  /** Extra controls before the tabs (the problem-panel toggle). */
  leading?: ReactNode;
}>) {
  const tabsId = useId();
  const split = useSyncExternalStore(subscribeSplit, isSplit, () => false);
  const view = split && pane === 'preview' ? 'code' : pane; // side by side, both are on screen
  const ext = q.framework === 'react' ? 'tsx' : 'html';
  return (
    <Card className="overflow-hidden">
      <div className="flex flex-wrap items-center gap-2 border-b border-line px-3 py-2">
        {leading}
        <Tabs id={tabsId} label="Workspace" value={view} onChange={onPane} tabs={paneTabs(split, showReference)} />
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
      <TabPanel id={tabsId} value={view}>
        {/* Panes stay mounted (just hidden) so switching tabs doesn't rebuild the editor or preview. */}
        <div hidden={view === 'reference'} className={cn('h-[75vh] min-h-96', split && 'grid grid-cols-2')}>
          <div hidden={!split && view !== 'code'} className="h-full min-h-0">
            <CodeEditor
              path={`file:///ui-${subject}-${q.id}.${ext}`}
              label={`Your code for ${q.title}`}
              value={code}
              onChange={onCode}
              onRun={() => onPane('preview')}
              className="h-full"
            />
          </div>
          <div hidden={!split && view !== 'preview'} className={cn('h-full min-h-0', split && 'border-l border-line')}>
            <LivePreview framework={q.framework} code={code} title={`${q.title} preview`} />
          </div>
        </div>
        {showReference && q.solution && (
          <div hidden={view !== 'reference'} className="grid h-[75vh] grid-rows-2">
            <CodeEditor path={`file:///ui-ref-${subject}-${q.id}.${ext}`} label="Reference solution" value={q.solution} readOnly className="min-h-0" />
            <div className="min-h-0 border-t border-line">
              <LivePreview framework={q.framework} code={q.solution} title={`${q.title} reference preview`} />
            </div>
          </div>
        )}
      </TabPanel>
    </Card>
  );
}
