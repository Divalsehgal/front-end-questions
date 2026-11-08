import { Code2, Eye, KeyRound, MonitorPlay, PanelRightClose, PanelRightOpen, Play, RotateCcw } from 'lucide-react';
import { useId, useState, useSyncExternalStore, type ReactNode } from 'react';
import { Button, Card, cn, IconButton, TabPanel, Tabs, type TabItem } from '../../ui';
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

const paneTabs = (split: boolean, previewOpen: boolean, showReference: boolean): TabItem<Pane>[] => [
  { value: 'code', label: split && previewOpen ? 'Code + Preview' : 'Code', icon: <Code2 size={14} /> },
  ...(split ? [] : [{ value: 'preview' as const, label: 'Preview', icon: <MonitorPlay size={14} /> }]),
  ...(showReference ? [{ value: 'reference' as const, label: 'Reference', icon: <KeyRound size={14} /> }] : []),
];

/** Run state: with auto-run off, the preview keeps the last code you ran (Run or Cmd/Ctrl+Enter). */
function useRun(code: string, showPreview: () => void) {
  const [previewOpen, setPreviewOpen] = useState(true);
  const [autoRun, setAuto] = useState(true);
  const [ranCode, setRanCode] = useState(code);
  return {
    previewOpen,
    setPreviewOpen,
    autoRun,
    setAutoRun: (on: boolean) => {
      setAuto(on);
      setRanCode(code);
    },
    previewCode: autoRun ? code : ranCode,
    runNow: () => {
      setRanCode(code);
      setPreviewOpen(true);
      showPreview();
    },
  };
}

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
  const { previewOpen, setPreviewOpen, autoRun, setAutoRun, previewCode, runNow } = useRun(code, () => onPane('preview'));
  const sideBySide = split && previewOpen;
  return (
    <Card className="overflow-hidden">
      <div className="flex flex-wrap items-center gap-2 border-b border-line px-3 py-2">
        {leading}
        <Tabs id={tabsId} label="Workspace" value={view} onChange={onPane} tabs={paneTabs(split, previewOpen, showReference)} />
        <div className="ml-auto flex flex-wrap items-center gap-1">
          <RunControls
            autoRun={autoRun}
            onAutoRun={setAutoRun}
            onRun={runNow}
            previewOpen={split ? previewOpen : undefined}
            onTogglePreview={() => setPreviewOpen((o) => !o)}
          />
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
        <div hidden={view === 'reference'} className={cn('h-[75vh] min-h-96', sideBySide && 'grid grid-cols-2')}>
          <div hidden={!split && view !== 'code'} className="h-full min-h-0">
            <CodeEditor
              path={`file:///ui-${subject}-${q.id}.${ext}`}
              label={`Your code for ${q.title}`}
              value={code}
              onChange={onCode}
              onRun={runNow}
              className="h-full"
            />
          </div>
          <div hidden={split ? !previewOpen : view !== 'preview'} className={cn('h-full min-h-0', sideBySide && 'border-l border-line')}>
            <LivePreview framework={q.framework} code={previewCode} title={`${q.title} preview`} />
          </div>
        </div>
        {showReference && q.solution && (
          <ReferencePane q={q} solution={q.solution} path={`file:///ui-ref-${subject}-${q.id}.${ext}`} hidden={view !== 'reference'} />
        )}
      </TabPanel>
    </Card>
  );
}

/** Sandbox run controls: auto-run on edit (or run by hand), and showing / hiding the preview beside the code. */
function RunControls({
  autoRun,
  onAutoRun,
  onRun,
  previewOpen,
  onTogglePreview,
}: Readonly<{ autoRun: boolean; onAutoRun: (on: boolean) => void; onRun: () => void; previewOpen?: boolean; onTogglePreview: () => void }>) {
  return (
    <>
      <label className="flex cursor-pointer items-center gap-1.5 px-2 text-xs text-text-muted">
        <input type="checkbox" role="switch" checked={autoRun} onChange={(e) => onAutoRun(e.target.checked)} className="accent-primary" />
        Auto-run
      </label>
      {!autoRun && (
        <Button variant="secondary" size="sm" onClick={onRun} title="Run (Cmd/Ctrl+Enter)">
          <Play size={14} aria-hidden /> Run
        </Button>
      )}
      {previewOpen !== undefined && (
        <IconButton label={previewOpen ? 'Hide preview' : 'Show preview'} onClick={onTogglePreview} className="border-0 p-1.5">
          {previewOpen ? <PanelRightClose size={16} aria-hidden /> : <PanelRightOpen size={16} aria-hidden />}
        </IconButton>
      )}
    </>
  );
}

/** The unlocked reference: its code above, its preview below. */
function ReferencePane({ q, solution, path, hidden }: Readonly<{ q: UiQuestion; solution: string; path: string; hidden: boolean }>) {
  return (
    <div hidden={hidden} className="grid h-[75vh] grid-rows-2">
      <CodeEditor path={path} label="Reference solution" value={solution} readOnly className="min-h-0" />
      <div className="min-h-0 border-t border-line">
        <LivePreview framework={q.framework} code={solution} title={`${q.title} reference preview`} />
      </div>
    </div>
  );
}
