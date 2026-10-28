import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// A six-dot sketch of the system: the browser at the top, three services, two stores. Each edge
// carries a pulse; the keyframes live in the SVG so they ship with the component.
const DOTS = { client: [60, 10], a: [22, 38], b: [60, 38], c: [98, 38], d: [40, 64], e: [80, 64] } as const;
type Dot = keyof typeof DOTS;
const EDGES: [Dot, Dot][] = [
  ['client', 'a'],
  ['client', 'b'],
  ['client', 'c'],
  ['a', 'd'],
  ['b', 'd'],
  ['b', 'e'],
  ['c', 'e'],
];
const DOT_CLASS: Record<Dot, string> = {
  client: 'fill-brand',
  a: 'fill-secondary',
  b: 'fill-secondary',
  c: 'fill-text-muted',
  d: 'fill-success',
  e: 'fill-success',
};
const path = (from: Dot, to: Dot) => `M${DOTS[from].join(' ')}L${DOTS[to].join(' ')}`;

// Pulses only travel for people who haven't asked for less motion; otherwise the dash stays parked off the path.
const PULSE_CSS = `
.arch-pulse { stroke-dasharray: 0.18 1; stroke-dashoffset: 0.18; }
@keyframes arch-pulse { from { stroke-dashoffset: 0.18; } to { stroke-dashoffset: -1; } }
@media (prefers-reduced-motion: no-preference) { .arch-pulse { animation: arch-pulse 2.4s linear infinite; } }
`;

function Thumbnail() {
  return (
    <svg viewBox="0 0 120 74" className="h-[74px] w-[120px] shrink-0" aria-hidden focusable="false">
      <style>{PULSE_CSS}</style>
      {EDGES.map(([from, to]) => (
        <path key={`${from}-${to}`} d={path(from, to)} className="stroke-line-strong" strokeWidth={1} fill="none" opacity={0.6} />
      ))}
      {EDGES.map(([from, to], i) => (
        <path
          key={`pulse-${from}-${to}`}
          d={path(from, to)}
          pathLength={1}
          className="arch-pulse stroke-brand"
          strokeWidth={2}
          strokeLinecap="round"
          fill="none"
          style={{ animationDelay: `${(i * 0.35).toFixed(2)}s` }}
        />
      ))}
      {(Object.keys(DOTS) as Dot[]).map((d) => (
        <circle key={d} cx={DOTS[d][0]} cy={DOTS[d][1]} r={d === 'client' ? 6 : 5} className={DOT_CLASS[d]} />
      ))}
    </svg>
  );
}

/** Dashboard card that opens the architecture diagram at /architecture. */
export function ArchitectureWidget() {
  return (
    <Link
      to="/architecture"
      className="group flex items-center gap-5 rounded-lg border border-line bg-surface p-5 transition-colors hover:border-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
    >
      <Thumbnail />
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1 font-semibold">
          How FE Grind is built
          <ArrowUpRight size={16} aria-hidden className="text-text-muted transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
        <span className="mt-1 block text-sm text-text-muted">What talks to what, and why: an architecture map generated from the code.</span>
      </span>
    </Link>
  );
}
