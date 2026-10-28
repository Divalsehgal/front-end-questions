import { Eye, Loader2, Play, RotateCcw, ShieldCheck } from 'lucide-react';
import { Button, Kbd, MOD } from '../../ui';

export function EditorToolbar({
  running,
  typeOnly,
  hasTypeTests,
  canReveal,
  onRun,
  onCheckTypes,
  onReveal,
  onReset,
}: {
  running: boolean;
  typeOnly: boolean;
  hasTypeTests: boolean;
  canReveal: boolean;
  onRun: () => void;
  onCheckTypes: () => void;
  onReveal: () => void;
  onReset: () => void;
}) {
  const RunIcon = running ? Loader2 : typeOnly ? ShieldCheck : Play;
  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-line px-3 py-2">
      <Button onClick={onRun} disabled={running} aria-busy={running}>
        <RunIcon size={16} aria-hidden className={running ? 'animate-spin' : undefined} /> {typeOnly ? 'Check types' : 'Run tests'}
      </Button>
      {hasTypeTests && !typeOnly && (
        <Button variant="secondary" onClick={onCheckTypes}>
          <ShieldCheck size={16} aria-hidden /> Check types
        </Button>
      )}
      <span className="hidden text-xs text-text-muted sm:inline">
        <Kbd>{MOD}</Kbd> <Kbd>Enter</Kbd>
      </span>
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
  );
}
