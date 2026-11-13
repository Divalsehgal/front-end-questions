import { resetSidebarWidth, resizeSidebar, SIDEBAR_MAX, SIDEBAR_MIN, toggleSidebar, useSidebar } from '../../state/sidebar';
import type { KeyboardEvent, PointerEvent } from 'react';

const STEP = 16;

/**
 * The draggable right edge of the desktop sidebar (a focusable window splitter): drag to resize,
 * drag far left to hide, double-click to reset. Keyboard: arrows resize, Home / End jump to the
 * limits, Enter hides.
 */
export function SidebarResizer() {
  const { width } = useSidebar();

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    e.preventDefault();
    const left = e.currentTarget.parentElement?.getBoundingClientRect().left ?? 0;
    // Listen on window: the sidebar (and this handle) disappears if the drag collapses it.
    const move = (ev: globalThis.PointerEvent) => resizeSidebar(ev.clientX - left);
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
    const next: Record<string, () => void> = {
      ArrowLeft: () => resizeSidebar(Math.max(SIDEBAR_MIN, width - STEP)),
      ArrowRight: () => resizeSidebar(width + STEP),
      Home: () => resizeSidebar(SIDEBAR_MIN),
      End: () => resizeSidebar(SIDEBAR_MAX),
      Enter: toggleSidebar,
    };
    const action = next[e.key];
    if (!action) return;
    e.preventDefault();
    action();
  };

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- window splitter (ARIA APG)
    <div
      role="separator"
      aria-orientation="vertical"
      aria-label="Resize sidebar"
      aria-valuemin={SIDEBAR_MIN}
      aria-valuemax={SIDEBAR_MAX}
      aria-valuenow={width}
      // A focusable separator is an interactive window splitter (ARIA APG), so it takes focus.
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
      tabIndex={0}
      title="Drag to resize · double-click to reset"
      onPointerDown={onPointerDown}
      onDoubleClick={resetSidebarWidth}
      onKeyDown={onKeyDown}
      className="group absolute inset-y-0 -right-1.5 z-10 hidden w-3 cursor-col-resize touch-none md:block"
    >
      <span aria-hidden className="mx-auto block h-full w-px bg-transparent transition-colors group-hover:bg-brand group-focus-visible:bg-brand" />
    </div>
  );
}
