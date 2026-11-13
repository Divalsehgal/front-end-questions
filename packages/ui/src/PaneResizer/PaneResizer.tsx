import { cn } from '../lib';

const STEP = 16;
type Edge = 'top' | 'right';
// [grow, shrink] keys: a console grows upward, a side panel grows rightward.
const KEYS: Record<Edge, [string, string]> = { top: ['ArrowUp', 'ArrowDown'], right: ['ArrowRight', 'ArrowLeft'] };

/**
 * A draggable edge for a pane, like a sandbox's panel splitter (an ARIA window splitter): drag it,
 * or focus it and use the arrow keys. Place it inside the pane; the pane's own container bounds it,
 * keeping `reserve` px for the neighbouring pane.
 */
export function PaneResizer({
  edge,
  size,
  min,
  reserve,
  label,
  onResize,
}: Readonly<{
  edge: Edge;
  /** Current size in px; leave it out while the pane still has its default (CSS) size, and it is measured. */
  size?: number;
  min: number;
  reserve: number;
  label: string;
  onResize: (px: number) => void;
}>) {
  const top = edge === 'top';
  const current = (handle: HTMLElement) => size ?? (top ? handle.parentElement?.offsetHeight : handle.parentElement?.offsetWidth) ?? 0;
  const clamp = (px: number, handle: HTMLElement) => {
    const box = handle.parentElement?.parentElement;
    const room = (top ? box?.clientHeight : box?.clientWidth) ?? 0;
    const max = room > 0 ? room - reserve : Infinity;
    onResize(Math.round(Math.max(min, Math.min(px, max))));
  };
  const [grow, shrink] = KEYS[edge];
  const cursor = top ? 'cursor-row-resize' : 'cursor-col-resize';
  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- window splitter (ARIA APG)
    <div
      role="separator"
      aria-orientation={top ? 'horizontal' : 'vertical'}
      aria-label={label}
      aria-valuenow={size}
      // A focusable separator is an interactive window splitter (ARIA APG), so it takes focus.
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
      tabIndex={0}
      title="Drag to resize"
      onPointerDown={(e) => {
        if (e.button !== 0) return;
        e.preventDefault();
        const handle = e.currentTarget;
        const start = top ? e.clientY : e.clientX;
        // Capture keeps the moves coming even while the pointer is over the preview iframe.
        handle.setPointerCapture(e.pointerId);
        const from = current(handle);
        const move = (ev: PointerEvent) => clamp(from + (top ? start - ev.clientY : ev.clientX - start), handle);
        const end = () => {
          document.body.classList.remove('select-none', cursor);
          handle.removeEventListener('pointermove', move);
          handle.removeEventListener('pointerup', end);
          handle.removeEventListener('pointercancel', end);
        };
        document.body.classList.add('select-none', cursor);
        handle.addEventListener('pointermove', move);
        handle.addEventListener('pointerup', end);
        handle.addEventListener('pointercancel', end);
      }}
      onKeyDown={(e) => {
        const step = { [grow]: STEP, [shrink]: -STEP }[e.key];
        if (!step) return;
        e.preventDefault();
        clamp(current(e.currentTarget) + step, e.currentTarget);
      }}
      className={cn(
        'absolute z-30 touch-none hover:bg-brand focus-visible:bg-brand focus-visible:outline-none',
        cursor,
        top ? 'inset-x-0 -top-1 h-2' : 'inset-y-0 -right-1 w-2',
      )}
    />
  );
}
