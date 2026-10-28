import { Check, Play, X } from 'lucide-react';
import { linesMatch, normalizeLine } from '../../runtime/format';
import { Card, cn, ResultHeader } from '../../ui';

export type Result = { real: string[]; mine: string[]; correct: boolean; gaveUp: boolean };

// Underlines the words in your line that don't appear at the same position in the real line.
export function TokenDiff({ line, against }: { line: string; against: string }) {
  const theirs = against.split(/\s+/).map(normalizeLine);
  return (
    <>
      {line.split(/(\s+)/).map((tok, i) =>
        /^\s+$/.test(tok) ? (
          tok
        ) : normalizeLine(tok) === theirs[i / 2] ? (
          <span key={i}>{tok}</span>
        ) : (
          <mark key={i} className="rounded bg-error-soft text-error underline decoration-wavy">
            {tok}
          </mark>
        ),
      )}
    </>
  );
}

function RealLine({ real }: { real?: string }) {
  if (real === undefined) return <span className="text-text-muted italic">(nothing more is logged)</span>;
  if (real === '') return <span className="text-text-muted italic">(empty line)</span>;
  return real;
}

function Line({ index, mine, real, gaveUp }: { index: number; mine?: string; real?: string; gaveUp: boolean }) {
  const ok = mine !== undefined && real !== undefined && linesMatch(mine, real);
  return (
    <li className="flex gap-3 border-t border-line px-4 py-2.5">
      <span className="w-5 shrink-0 text-right text-text-muted">{index + 1}</span>
      <div className="min-w-0 flex-1 space-y-1">
        {!gaveUp && (
          <div className="flex gap-3">
            <span className="w-10 shrink-0 font-sans text-xs leading-5 text-text-muted">You</span>
            <span className={cn('break-all whitespace-pre-wrap', ok ? 'text-success' : 'text-error')}>
              {mine === undefined ? <span className="italic">(missing)</span> : ok ? mine : <TokenDiff line={mine} against={real ?? ''} />}
              <span className="sr-only">{ok ? ' (matches)' : ' (differs)'}</span>
            </span>
          </div>
        )}
        {(gaveUp || !ok) && (
          <div className="flex gap-3">
            <span className="flex w-10 shrink-0 items-center gap-1 font-sans text-xs leading-5 text-text-muted">
              <Play size={10} aria-hidden /> Real
            </span>
            <span className="break-all whitespace-pre-wrap">
              <RealLine real={real} />
            </span>
          </div>
        )}
      </div>
    </li>
  );
}

export function OutputResult({ result }: { result: Result }) {
  const count = Math.max(result.real.length, result.gaveUp ? 0 : result.mine.length);
  return (
    <Card className="overflow-hidden">
      <ResultHeader ok={result.correct} icon={result.correct ? <Check size={16} aria-hidden /> : <X size={16} aria-hidden />}>
        {result.correct ? 'Correct!' : result.gaveUp ? 'Here is the real output' : 'Not quite. Compare line by line'}
      </ResultHeader>
      <ol className="font-mono text-sm" aria-label="Output, line by line">
        {Array.from({ length: count }, (_, i) => (
          <Line key={i} index={i} mine={result.mine[i]} real={result.real[i]} gaveUp={result.gaveUp} />
        ))}
      </ol>
    </Card>
  );
}
