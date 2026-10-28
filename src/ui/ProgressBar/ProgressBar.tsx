export function ProgressBar({ value, total, label = 'Progress' }: Readonly<{ value: number; total: number; label?: string }>) {
  const pct = total ? Math.round((value / total) * 100) : 0;
  return (
    <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-surface-muted">
      {/* A native <progress> for assistive tech; the styled bar below is its visual twin. */}
      <progress className="sr-only" aria-label={label} value={pct} max={100} aria-valuetext={`${value} of ${total}`} />
      {/* Scale instead of width so the change animates on the compositor. */}
      <div
        aria-hidden
        className="h-full origin-left rounded-full bg-linear-to-r from-brand to-secondary transition-transform"
        style={{ transform: `scaleX(${pct / 100})` }}
      />
    </div>
  );
}
