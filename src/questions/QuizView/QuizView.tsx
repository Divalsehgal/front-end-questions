import { useState } from 'react';
import { Button, inline, Kbd } from '../../ui';
import { CodeBlock } from '../../ui/code';
import { confirmReveal, useFirstVerdict, useShortcuts, type ViewProps } from '../shared';
import { QuizAnswer, QuizResult, resultTitle, useQuizOptions } from './QuizAnswer';
import { QuizOption, type OptionState } from './QuizOption';
import type { QuizQuestion } from '../../content/types';

export function QuizView({ q, onResult }: ViewProps<QuizQuestion>) {
  const multi = Array.isArray(q.answer);
  const { correct, options } = useQuizOptions(q);
  const [picked, setPicked] = useState<Set<number>>(new Set());
  const [submitted, setSubmitted] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const verdict = useFirstVerdict(onResult);
  const isRight = options.every((o, i) => o.correct === picked.has(i));

  const toggle = (i: number) =>
    setPicked((cur) => {
      if (!multi) return new Set([i]);
      const next = new Set(cur);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  const submit = () => {
    if (!picked.size || submitted) return;
    setSubmitted(true);
    verdict(isRight);
  };

  // Opening the answer before answering is a miss, like revealing a drill's solution.
  const reveal = () => {
    if (!confirmReveal(false)) return false;
    setPicked(new Set());
    setSubmitted(true);
    setRevealed(true);
    verdict(false);
    return true;
  };

  useShortcuts((e) => {
    if (submitted) return;
    const n = Number(e.key);
    if (n >= 1 && n <= options.length) toggle(n - 1);
    if (e.key === 'Enter' && picked.size) {
      // Don't also "click" whatever button still has focus (e.g. Next), which would skip the explanation.
      e.preventDefault();
      submit();
    }
  });

  const stateOf = (correct: boolean, chosen: boolean): OptionState =>
    !submitted ? (chosen ? 'picked' : 'idle') : correct ? 'right' : chosen ? 'wrong' : 'idle';

  return (
    <div className="space-y-5">
      <p id={`${q.id}-prompt`} className="text-lg leading-8 font-medium">
        {inline(q.prompt)}
      </p>
      {q.code && <CodeBlock code={q.code} />}
      {multi && !submitted && <p className="text-sm text-text-muted">Select all that apply.</p>}

      <div className="space-y-2" role={multi ? 'group' : 'radiogroup'} aria-labelledby={`${q.id}-prompt`}>
        {options.map((o, i) => (
          <QuizOption
            key={o.text}
            index={i}
            text={o.text}
            multi={multi}
            checked={picked.has(i)}
            state={stateOf(o.correct, picked.has(i))}
            disabled={submitted}
            onToggle={() => toggle(i)}
          />
        ))}
      </div>

      {!submitted ? (
        <>
          <div className="flex items-center gap-3">
            <Button onClick={submit} disabled={!picked.size}>
              Submit
            </Button>
            <span className="text-xs text-text-muted">
              <Kbd>1</Kbd>–<Kbd>{options.length}</Kbd> to choose, <Kbd>Enter</Kbd> to submit
            </span>
          </div>
          <QuizAnswer q={q} correct={correct} onOpen={reveal} />
        </>
      ) : (
        <QuizResult why={q.why} isRight={isRight} title={resultTitle(isRight, revealed, multi)} />
      )}
    </div>
  );
}
