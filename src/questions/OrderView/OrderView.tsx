import { Check } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button, inline, useHydrated } from '../../ui';
import { confirmReveal, shuffle, useFirstVerdict, type ViewProps } from '../shared';
import { OrderAnswer, OrderResult } from './OrderAnswer';
import { OrderRow, type RowState } from './OrderRow';
import type { OrderQuestion } from '../../content/types';

export function initialOrder(items: string[]) {
  // Never start already solved.
  for (let i = 0; i < 10; i++) {
    const s = shuffle(items);
    if (s.some((x, j) => x !== items[j])) return s;
  }
  return [...items].reverse();
}

function rowState(checked: boolean, right: boolean): RowState {
  if (!checked) return 'idle';
  return right ? 'right' : 'wrong';
}

export function OrderView({ q, onResult }: Readonly<ViewProps<OrderQuestion>>) {
  // Random start in the browser; prerendered HTML (and hydration) uses the reversed order so markup matches.
  const hydrated = useHydrated();
  const start = useMemo(() => (hydrated ? initialOrder(q.items) : [...q.items].reverse()), [q, hydrated]);
  const [moved, setMoved] = useState<string[] | null>(null);
  const order = moved ?? start;
  const [dragging, setDragging] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const verdict = useFirstVerdict(onResult);
  const allRight = order.every((x, i) => x === q.items[i]);

  const move = (from: number, to: number) => {
    if (checked || to < 0 || to >= order.length || from === to) return;
    setMoved((cur) => {
      const next = [...(cur ?? start)];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });
  };

  const check = () => {
    setChecked(true);
    verdict(allRight);
  };

  const reveal = () => {
    if (!confirmReveal(false)) return false;
    setChecked(true);
    setRevealed(true);
    verdict(false);
    return true;
  };

  return (
    <div className="space-y-5">
      <p className="text-lg leading-8 font-medium">{inline(q.prompt)}</p>
      <p className="text-sm text-text-muted">Drag the rows, or use the arrows, to put them in order from first to last.</p>

      <ol className="space-y-2" aria-label="Steps">
        {order.map((item, i) => (
          <OrderRow
            key={item}
            item={item}
            index={i}
            count={order.length}
            state={rowState(checked, item === q.items[i])}
            locked={checked}
            dragging={dragging === i}
            onMove={(to) => move(i, to)}
            onDragStart={() => setDragging(i)}
            onDragOver={(e) => {
              e.preventDefault();
              if (dragging !== null && dragging !== i) {
                move(dragging, i);
                setDragging(i);
              }
            }}
            onDragEnd={() => setDragging(null)}
          />
        ))}
      </ol>

      {!checked ? (
        <>
          <Button onClick={check}>
            <Check size={16} aria-hidden /> Check order
          </Button>
          <OrderAnswer q={q} onOpen={reveal} />
        </>
      ) : (
        <OrderResult q={q} allRight={allRight} revealed={revealed} />
      )}
    </div>
  );
}
