import { ArrowDown, ArrowUp, Check, GripVertical, X } from 'lucide-react';
import { cn, inline } from '../../ui';
import type { DragEvent, ReactNode } from 'react';

export type RowState = 'idle' | 'right' | 'wrong';

const STYLES: Record<RowState, string> = {
  idle: 'border-line bg-surface',
  right: 'border-success bg-success-soft',
  wrong: 'border-error bg-error-soft',
};

const MARKS: Record<RowState, ReactNode> = {
  idle: null,
  right: <Check size={14} className="text-success" />,
  wrong: <X size={14} className="text-error" />,
};

const MOVE_BUTTON = 'rounded p-1 text-text-muted hover:bg-surface-muted hover:text-text-main disabled:opacity-50';

export function OrderRow({
  item,
  index,
  count,
  state,
  locked,
  dragging,
  onMove,
  onDragStart,
  onDragOver,
  onDragEnd,
}: Readonly<{
  item: string;
  index: number;
  count: number;
  state: RowState;
  locked: boolean;
  dragging: boolean;
  onMove: (to: number) => void;
  onDragStart: () => void;
  onDragOver: (e: DragEvent) => void;
  onDragEnd: () => void;
}>) {
  return (
    <li
      draggable={!locked}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      className={cn(
        'flex items-center gap-3 rounded-lg border p-3 text-[15px] leading-6 transition-opacity',
        STYLES[state],
        dragging && 'opacity-50',
        !locked && 'cursor-grab',
      )}
    >
      {!locked && <GripVertical size={16} aria-hidden className="shrink-0 text-text-muted" />}
      <span aria-hidden className="grid size-6 shrink-0 place-items-center rounded-md border border-line bg-surface font-mono text-xs text-text-muted">
        {MARKS[state] ?? index + 1}
      </span>
      <span className="min-w-0 flex-1">
        {inline(item)}
        {state !== 'idle' && <span className="sr-only"> ({state === 'right' ? 'in the right place' : 'out of place'})</span>}
      </span>
      {!locked && (
        <span className="flex shrink-0 gap-1">
          <button type="button" onClick={() => onMove(index - 1)} disabled={index === 0} aria-label={`Move "${item}" up`} className={MOVE_BUTTON}>
            <ArrowUp size={14} aria-hidden />
          </button>
          <button type="button" onClick={() => onMove(index + 1)} disabled={index === count - 1} aria-label={`Move "${item}" down`} className={MOVE_BUTTON}>
            <ArrowDown size={14} aria-hidden />
          </button>
        </span>
      )}
    </li>
  );
}
