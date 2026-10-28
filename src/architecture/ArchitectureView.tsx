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
 * The architecture as stacked tiers, upgraded to the interactive canvas once it is in view on a wide
 * screen. The canvas chunk (React Flow) is only downloaded then; the prerender and phones never load it.
 */
export function ArchitectureView({ architecture }: Readonly<{ architecture: Architecture }>) {
  const ref = useRef<HTMLDivElement>(null);
  const wide = useSyncExternalStore(subscribeWide, isWide, () => false);
  const seen = useSeen(ref);
  const tiers = <TierList architecture={architecture} />;

  return (
    <div ref={ref}>
      {wide && seen ? (
        <Suspense fallback={tiers}>
          <ArchitectureDiagram architecture={architecture} />
        </Suspense>
      ) : (
        tiers
      )}
    </div>
  );
}
