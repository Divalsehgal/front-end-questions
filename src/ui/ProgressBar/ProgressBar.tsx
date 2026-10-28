export function ProgressBar({ value, total, label = 'Progress' }: { value: number; total: number; label?: string }) {
  const pct = total ? Math.round((value / total) * 100) : 0;
  return (
    <div
      className="h-1.5 w-full overflow-hidden rounded-full bg-surface-muted"
      role="progressbar"
      aria-label={label}
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuetext={`${value} of ${total}`}
    >
      {/* Scale instead of width so the change animates on the compositor. */}
      <div className="h-full origin-left rounded-full bg-brand transition-transform" style={{ transform: `scaleX(${pct / 100})` }} />
    </div>
  );
}
