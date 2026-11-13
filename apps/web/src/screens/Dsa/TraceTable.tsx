import { cn } from '@fe-grind/ui/lib';
import type { Step } from '@fe-grind/dsa/tracer';

/** One row per step, one column per variable; a cell whose value just changed is highlighted. */
export function TraceTable({ steps, cols }: Readonly<{ steps: Step[]; cols: string[] }>) {
  return (
    <div className="max-h-[calc(100dvh-16rem)] overflow-auto rounded-xl border border-line bg-surface shadow-sm max-md:max-h-none">
      <table className="w-full border-collapse font-mono text-xs">
        <thead>
          <tr>
            {['#', 'Step', ...cols].map((c) => (
              <th
                key={c}
                scope="col"
                className="sticky top-0 z-10 border-b border-line bg-surface-muted px-3 py-2 text-left font-sans font-semibold whitespace-nowrap"
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {steps.map((s, i) => (
            // Steps have no id of their own and never reorder: the position is the identity.
            // eslint-disable-next-line react/no-array-index-key
            <tr key={i} className="border-b border-line last:border-b-0">
              <td className="px-3 py-1.5 align-top text-text-muted tabular-nums">{i + 1}</td>
              <td className="min-w-56 px-3 py-1.5 align-top font-sans text-[13px]">{s.note}</td>
              {cols.map((c) => {
                const v = s.vals[c];
                const changed = v !== undefined && v !== steps[i - 1]?.vals[c];
                return (
                  <td key={c} className={cn('px-3 py-1.5 align-top whitespace-nowrap', changed ? 'bg-brand-soft text-text-main' : 'text-text-muted')}>
                    {v ?? ''}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
