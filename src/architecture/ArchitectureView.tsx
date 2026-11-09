import { lazy, Suspense, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { TierList } from './TierList';
import type { Architecture } from './schema';
import type { RefObject } from 'react';

const ArchitectureDiagram = lazy(() => import('./ArchitectureDiagram').then((m) => ({ default: m.ArchitectureDiagram })));

/** Narrower than this, the canvas is too cramped to read: phones get the stacked tiers instead. */
export const WIDE_QUERY = '(min-width: 768px)';

function subscribeWide(onChange: () => void) {
  if (typeof matchMedia !== 'function') return () => undefined;
  const mq = matchMedia(WIDE_QUERY);
  mq.addEventListener('change', onChange);
  return () => mq.removeEventListener('change', onChange);
}
const isWide = () => typeof matchMedia === 'function' && matchMedia(WIDE_QUERY).matches;

/** True once the element has scrolled into view (immediately where IntersectionObserver is missing). */
function useSeen(ref: RefObject<HTMLElement | null>) {
  const [seen, setSeen] = useState(() => typeof IntersectionObserver === 'undefined');
  useEffect(() => {
    const el = ref.current;
    if (seen || !el) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) setSeen(true);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, seen]);
  return seen;
}

/**
 * Phones (and the prerender) get the stacked tiers. Wide screens get the interactive canvas once it is in
 * view, with an empty canvas-sized box until then, so the tiers never flash before the diagram. The canvas
 * chunk (React Flow) is only downloaded on wide screens.
 */
export function ArchitectureView({ architecture }: Readonly<{ architecture: Architecture }>) {
  const ref = useRef<HTMLDivElement>(null);
  const wide = useSyncExternalStore(subscribeWide, isWide, () => false);
  const seen = useSeen(ref);
  // Same size and frame as the canvas (ArchitectureDiagram), so nothing shifts when it arrives.
  const placeholder = (
    <div className="h-[560px] rounded-lg border border-line bg-surface" role="status" aria-label="Loading diagram" data-testid="architecture-placeholder" />
  );

  return (
    <div ref={ref}>
      {!wide && <TierList architecture={architecture} />}
      {wide && !seen && placeholder}
      {wide && seen && (
        <Suspense fallback={placeholder}>
          <ArchitectureDiagram architecture={architecture} />
        </Suspense>
      )}
    </div>
  );
}
