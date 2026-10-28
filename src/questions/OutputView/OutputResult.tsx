import { Check, Play, X } from 'lucide-react';
import { linesMatch, normalizeLine } from '../../runtime/format';
import { Card, cn, ResultHeader, withStableKeys } from '../../ui';

export type Result = { real: string[]; mine: string[]; correct: boolean; gaveUp: boolean };

// Underlines the words in your line that don't appear at the same position in the real line.
export function TokenDiff({ line, against }: Readonly<{ line: string; against: string }>) {
  const theirs = against.split(/\s+/).map(normalizeLine);
  return (
    <>
      {withStableKeys(line.split(/(\s+)/)).map(({ item: tok, key }, i) => {
        if (/^\s+$/.test(tok)) return tok;
        if (normalizeLine(tok) === theirs[i / 2]) return <span key={key}>{tok}</span>;
        return (
          <mark key={key} className="rounded bg-error-soft text-error underline decoration-wavy">
            {tok}
          </mark>
        );
      })}
    </>
  );
}

function RealLine({ real }: Readonly<{ real?: string }>) {
  if (real === undefined) return <span className="text-text-muted italic">(nothing more is logged)</span>;
  if (real === '') return <span className="text-text-muted italic">(empty line)</span>;
  return real;
}

function YourLine({ mine, real, ok }: Readonly<{ mine?: string; real?: string; ok: boolean }>) {
  if (mine === undefined) return <span className="italic">(missing)</span>;
  return ok ? mine : <TokenDiff line={mine} against={real ?? ''} />;
}

function Line({ index, mine, real, gaveUp }: Readonly<{ index: number; mine?: string; real?: string; gaveUp: boolean }>) {
  const ok = mine !== undefined && real !== undefined && linesMatch(mine, real);
  return (
    <li className="flex gap-3 border-t border-line px-4 py-2.5">
      <span className="w-5 shrink-0 text-right text-text-muted">{index + 1}</span>
      <div className="min-w-0 flex-1 space-y-1">
        {!gaveUp && (
          <div className="flex gap-3">
            <span className="w-10 shrink-0 font-sans text-xs leading-5 text-text-muted">You</span>
            <span className={cn('break-all whitespace-pre-wrap', ok ? 'text-success' : 'text-error')}>
              <YourLine mine={mine} real={real} ok={ok} />
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

function headline(result: Result) {
  if (result.correct) return 'Correct!';
  return result.gaveUp ? 'Here is the real output' : 'Not quite. Compare line by line';
}

export function OutputResult({ result }: Readonly<{ result: Result }>) {
  const count = Math.max(result.real.length, result.gaveUp ? 0 : result.mine.length);
  const rows = Array.from({ length: count }, (_, i) => ({ mine: result.mine[i], real: result.real[i] }));
  return (
    <Card className="overflow-hidden">
      <ResultHeader ok={result.correct} icon={result.correct ? <Check size={16} aria-hidden /> : <X size={16} aria-hidden />}>
        {headline(result)}
      </ResultHeader>
      <ol className="font-mono text-sm" aria-label="Output, line by line">
        {withStableKeys(rows, (r) => JSON.stringify([r.mine, r.real])).map(({ item, key }, i) => (
          <Line key={key} index={i} mine={item.mine} real={item.real} gaveUp={result.gaveUp} />
        ))}
      </ol>
    </Card>
  );
}
