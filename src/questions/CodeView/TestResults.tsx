import { Check, KeyRound, X } from 'lucide-react';
import { Button, Card, ResultHeader } from '../../ui';
import { allPassed, type RunState } from './useCodeRun';

export function TestResults({ run, onCompare }: { run: NonNullable<RunState>; onCompare?: () => void }) {
  const passed = run.results.filter((r) => r.ok).length;
  const ok = allPassed(run);
  return (
    <Card className="overflow-hidden">
      <ResultHeader ok={ok} icon={ok ? <Check size={16} aria-hidden /> : <X size={16} aria-hidden />}>
        {run.fatal ? 'Could not run' : ok ? `All ${passed} tests passed` : `${passed} / ${run.results.length} tests passed`}
      </ResultHeader>
      {run.fatal && <pre className="px-4 py-3 font-mono text-sm whitespace-pre-wrap text-error">{run.fatal}</pre>}
      <ul aria-label="Test results">
        {run.results.map((r) => (
          <li key={r.name} className="border-t border-line px-4 py-2.5 text-sm">
            <div className="flex items-start gap-2">
              {r.ok ? (
                <Check size={16} role="img" aria-label="Passed" className="mt-0.5 shrink-0 text-success" />
              ) : (
                <X size={16} role="img" aria-label="Failed" className="mt-0.5 shrink-0 text-error" />
              )}
              <span className={r.ok ? '' : 'font-medium'}>{r.name}</span>
            </div>
            {r.error && <pre className="mt-1 ml-6 font-mono text-xs whitespace-pre-wrap text-error">{r.error}</pre>}
          </li>
        ))}
      </ul>
      {run.logs.length > 0 && (
        <div className="border-t border-line bg-code px-4 py-3">
          <p className="mb-1 text-xs font-medium text-text-muted">Your console output</p>
          <pre className="max-h-40 overflow-auto font-mono text-xs leading-5">{run.logs.join('\n')}</pre>
        </div>
      )}
      {ok && onCompare && (
        <div className="border-t border-line px-4 py-3">
          <Button variant="secondary" size="sm" onClick={onCompare}>
            <KeyRound size={14} aria-hidden /> Compare with the reference solution
          </Button>
        </div>
      )}
    </Card>
  );
}
