import { Check } from 'lucide-react';
import { useId } from 'react';
import { Button, Card, inline } from '../../ui';

export function Requirements({
  items,
  done,
  onToggle,
  submitted,
  onSubmit,
}: {
  items: string[];
  done: Set<number>;
  onToggle: (i: number) => void;
  submitted: boolean;
  onSubmit: () => void;
}) {
  const id = useId();
  return (
    <Card className="overflow-hidden">
      <p id={id} className="border-b border-line px-4 py-3 text-sm font-semibold">
        Requirements · {done.size} / {items.length}
      </p>
      <ul aria-labelledby={id}>
        {items.map((r, i) => (
          <li key={i} className="border-b border-line last:border-0">
            <label className="flex w-full cursor-pointer items-start gap-3 px-4 py-2.5 text-sm hover:bg-surface-muted has-disabled:cursor-default">
              <input type="checkbox" checked={done.has(i)} disabled={submitted} onChange={() => onToggle(i)} className="mt-0.5 size-4 shrink-0 accent-brand" />
              <span className={done.has(i) ? 'text-text-muted line-through' : ''}>{inline(r)}</span>
            </label>
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap items-center gap-2 border-t border-line px-4 py-3">
        {!submitted ? (
          <>
            <Button onClick={onSubmit} disabled={done.size < items.length}>
              <Check size={16} aria-hidden /> Mark as done
            </Button>
            <span className="text-xs text-text-muted">Tick every requirement after checking it in the preview.</span>
          </>
        ) : (
          <p role="status" className="flex items-center gap-2 text-sm font-medium text-success">
            <Check size={16} aria-hidden /> Done. It will come back in Review to rebuild from scratch.
          </p>
        )}
      </div>
    </Card>
  );
}
