import { Lightbulb, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { expectedOutput } from '../../runtime/sandbox';
import { Button, Callout } from '../../ui';
import { CodeBlock, Prose } from '../../ui/code';
import { AnswerDisclosure, confirmReveal, useFirstVerdict, type ViewProps } from '../shared';
import { AnswerForm } from './AnswerForm';
import { allLinesMatch, toLines } from './lines';
import { OutputResult, type Result } from './OutputResult';
import type { OutputQuestion } from '../../content/types';

export function OutputView({ q, onResult }: Readonly<ViewProps<OutputQuestion>>) {
  const [answer, setAnswer] = useState('');
  const [result, setResult] = useState<Result | null>(null);
  const [lineCount, setLineCount] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const verdict = useFirstVerdict(onResult);
  const lang = q.lang ?? 'js';

  const finish = async (gaveUp: boolean) => {
    setBusy(true);
    const real = await expectedOutput(q.code, lang);
    const mine = toLines(answer);
    const correct = !gaveUp && allLinesMatch(mine, real);
    setResult({ real, mine, correct, gaveUp });
    setBusy(false);
    verdict(correct);
  };

  return (
    <div className="space-y-5">
      <CodeBlock code={q.code} lang={lang === 'ts' ? 'tsx' : 'jsx'} />

      {!result ? (
        <>
          <AnswerForm
            answer={answer}
            onAnswer={setAnswer}
            onCheck={() => void finish(false)}
            onGiveUp={() => void finish(true)}
            onHint={async () => setLineCount((await expectedOutput(q.code, lang)).length)}
            lineCount={lineCount}
            busy={busy}
          />
          {!busy && (
            <AnswerDisclosure
              onOpen={() => {
                if (!confirmReveal(false)) return false;
                void finish(true);
                return true;
              }}
            >
              <p className="text-sm text-text-muted">
                The expected output comes from actually running the snippet; opening this shows it next to the explanation.
              </p>
              <Prose text={q.why} />
            </AnswerDisclosure>
          )}
        </>
      ) : (
        <>
          <OutputResult result={result} />
          <Callout title="Why" icon={<Lightbulb size={16} aria-hidden />}>
            <Prose text={q.why} />
          </Callout>
          {!result.correct && (
            <Button variant="secondary" onClick={() => setResult(null)}>
              <RotateCcw size={16} aria-hidden /> Edit my answer and re-check
            </Button>
          )}
        </>
      )}
    </div>
  );
}
