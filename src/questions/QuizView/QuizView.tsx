import { useState } from 'react';
import { Button, inline, Kbd } from '../../ui';
import { CodeBlock } from '../../ui/code';
import { confirmReveal, useFirstVerdict, useShortcuts, type ViewProps } from '../shared';
import { QuizAnswer, QuizResult, resultTitle, useQuizOptions } from './QuizAnswer';
import { QuizOption, type OptionState } from './QuizOption';
import type { QuizQuestion } from '../../content/types';

function optionState(submitted: boolean, correct: boolean, chosen: boolean): OptionState {
  if (!submitted) return chosen ? 'picked' : 'idle';
  if (correct) return 'right';
  return chosen ? 'wrong' : 'idle';
}

export function QuizView({ q, onResult }: Readonly<ViewProps<QuizQuestion>>) {
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

  return (
    <div className="space-y-5">
      {/* The prompt is the options' legend, so the group (radios or checkboxes) is named by the question. */}
      <fieldset className="min-w-0 space-y-5">
        <legend className="text-lg leading-8 font-medium">{inline(q.prompt)}</legend>
        {q.code && <CodeBlock code={q.code} />}
        {multi && !submitted && <p className="text-sm text-text-muted">Select all that apply.</p>}
        <div className="space-y-2">
          {options.map((o, i) => (
            <QuizOption
              key={o.text}
              name={`${q.id}-answer`}
              index={i}
              text={o.text}
              multi={multi}
              checked={picked.has(i)}
              state={optionState(submitted, o.correct, picked.has(i))}
              disabled={submitted}
              onToggle={() => toggle(i)}
            />
          ))}
        </div>
      </fieldset>

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
