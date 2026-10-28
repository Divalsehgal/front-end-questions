import { Check, Eye, Lightbulb } from 'lucide-react';
import { useId } from 'react';
import { Button, Card, Kbd, MOD } from '../../ui';

const hintLabel = (lineCount: number | null) => {
  if (lineCount === null) return 'Hint';
  return `It logs ${lineCount} line${lineCount === 1 ? '' : 's'}`;
};

export function AnswerForm({
  answer,
  onAnswer,
  onCheck,
  onGiveUp,
  onHint,
  lineCount,
  busy,
}: Readonly<{
  answer: string;
  onAnswer: (v: string) => void;
  onCheck: () => void;
  onGiveUp: () => void;
  onHint: () => void;
  lineCount: number | null;
  busy: boolean;
}>) {
  const id = useId();
  return (
    <Card className="p-4">
      <label htmlFor={id} className="mb-2 block text-sm font-medium">
        What does it log? One line per console.log
      </label>
      <p id={`${id}-help`} className="mb-2 text-xs text-text-muted">
        Spaces and quote style don’t matter · write a thrown error as <code className="font-mono">TypeError</code>
      </p>
      <textarea
        id={id}
        aria-describedby={`${id}-help`}
        value={answer}
        onChange={(e) => onAnswer(e.target.value)}
        onKeyDown={(e) => {
          if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && answer.trim()) onCheck();
        }}
        rows={Math.max(4, answer.split('\n').length + 1)}
        spellCheck={false}
        placeholder={'1\n7\nouter undefined'}
        className="w-full resize-y rounded-lg border border-line-strong bg-code p-3 font-mono text-sm leading-6 focus:border-brand"
      />
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Button onClick={onCheck} disabled={!answer.trim() || busy}>
          <Check size={16} aria-hidden /> Check answer
        </Button>
        <span className="text-xs text-text-muted">
          <Kbd>{MOD}</Kbd> <Kbd>Enter</Kbd>
        </span>
        <div className="ml-auto flex gap-2">
          <Button variant="ghost" onClick={onHint} disabled={lineCount !== null}>
            <Lightbulb size={16} aria-hidden /> {hintLabel(lineCount)}
          </Button>
          <Button variant="ghost" onClick={onGiveUp} disabled={busy}>
            <Eye size={16} aria-hidden /> Show answer
          </Button>
        </div>
      </div>
    </Card>
  );
}
