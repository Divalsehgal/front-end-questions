import { useRef, type CSSProperties, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react';
import { cn } from '../lib';

const STEP = 2;

/**
 * Two columns with a draggable splitter between them (from the `xl` breakpoint; below it they
 * stack). `value` is the left column's share of the width in percent. Like the sidebar edge: drag
 * to resize, double-click to reset; keyboard: arrows resize, Home / End jump to the limits.
 */
export function SplitPane({
  label,
  value,
  min,
  max,
  onChange,
  onReset,
  left,
  right,
  className,
}: Readonly<{
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (pct: number) => void;
  onReset: () => void;
  left: ReactNode;
  right: ReactNode;
  className?: string;
}>) {
  const ref = useRef<HTMLDivElement>(null);

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    e.preventDefault();
    const box = ref.current?.getBoundingClientRect();
    if (!box?.width) return;
    const move = (ev: globalThis.PointerEvent) => onChange(((ev.clientX - box.left) / box.width) * 100);
    const end = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', end);
      window.removeEventListener('pointercancel', end);
      document.body.classList.remove('select-none', 'cursor-col-resize');
    };
    document.body.classList.add('select-none', 'cursor-col-resize');
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', end);
    window.addEventListener('pointercancel', end);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const next: Record<string, number> = { ArrowLeft: value - STEP, ArrowRight: value + STEP, Home: min, End: max };
    if (!(e.key in next)) return;
    e.preventDefault();
    onChange(next[e.key]);
  };

  return (
    <div
      ref={ref}
      style={{ '--split': `${value}%` } as CSSProperties}
      className={cn('grid gap-5 xl:grid-cols-[minmax(0,calc(var(--split)_-_10px))_auto_minmax(0,1fr)] xl:gap-0', className)}
    >
      {left}
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- window splitter (ARIA APG) */}
      <div
        role="separator"
        aria-orientation="vertical"
        aria-label={label}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        // A focusable separator is an interactive window splitter (ARIA APG), so it takes focus.
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        tabIndex={0}
        title="Drag to resize · double-click to reset"
        onPointerDown={onPointerDown}
        onDoubleClick={onReset}
        onKeyDown={onKeyDown}
        className="group hidden w-5 cursor-col-resize touch-none justify-center outline-none xl:flex"
      >
        <span aria-hidden className="block h-full w-px bg-line transition-colors group-hover:bg-brand group-focus-visible:bg-brand" />
      </div>
      {right}
    </div>
  );
}
