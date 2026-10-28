import { Check, Eye, Repeat2, X } from 'lucide-react';
import { useState } from 'react';
import { Button, Callout, Card, inline, Kbd } from '../../ui';
import { CodeBlock, Prose } from '../../ui/code';
import { AnswerDisclosure, useFirstVerdict, useShortcuts, type ViewProps } from '../shared';
import type { FlashcardQuestion } from '../../content/types';

export function FlashcardView({ q, onResult }: Readonly<ViewProps<FlashcardQuestion>>) {
  const [revealed, setRevealed] = useState(false);
  const [rated, setRated] = useState<boolean | null>(null);
  const verdict = useFirstVerdict(onResult);

  const rate = (knew: boolean) => {
    setRated(knew);
    verdict(knew);
  };

  useShortcuts((e) => {
    if (!revealed && (e.key === ' ' || e.key === 'Enter')) {
      e.preventDefault();
      setRevealed(true);
    } else if (revealed && rated === null && (e.key === '1' || e.key === '2')) {
      rate(e.key === '1');
    }
  });

  return (
    <div className="space-y-5">
      <Card className="p-6">
        <p className="mb-2 flex items-center gap-2 text-xs font-semibold tracking-wider text-text-muted uppercase">
          <Repeat2 size={14} aria-hidden /> Recall it before you reveal
        </p>
        <p className="text-lg leading-8 font-medium">{inline(q.front)}</p>
        {q.code && (
          <div className="mt-4">
            <CodeBlock code={q.code} />
          </div>
        )}
      </Card>

      {!revealed ? (
        <>
          <div className="flex items-center gap-3">
            <Button onClick={() => setRevealed(true)}>
              <Eye size={16} aria-hidden /> Reveal answer
            </Button>
            <span className="text-xs text-text-muted">
              <Kbd>Space</Kbd> to reveal
            </span>
          </div>
          {/* Same as "Reveal answer" (you rate yourself next); here so the answer is in the page's HTML. */}
          <AnswerDisclosure
            onOpen={() => {
              setRevealed(true);
              return true;
            }}
          >
            <Prose text={q.back} />
          </AnswerDisclosure>
        </>
      ) : (
        <>
          <section aria-label="Answer" className="rounded-lg border border-brand/40 bg-surface p-6">
            <Prose text={q.back} />
          </section>
          {rated === null ? (
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium">Did you have it?</span>
              <Button variant="success" onClick={() => rate(true)}>
                <Check size={16} aria-hidden /> I knew it
              </Button>
              <Button variant="secondary" onClick={() => rate(false)}>
                <X size={16} aria-hidden /> Not really
              </Button>
              <span className="text-xs text-text-muted">
                <Kbd>1</Kbd> / <Kbd>2</Kbd>
              </span>
            </div>
          ) : (
            <Callout role="status" tone={rated ? 'success' : 'warn'}>
              {rated
                ? 'Nice. It will come back in a few days to make sure it sticks.'
                : 'No problem. It will come back in Review until it sticks. Try saying the answer out loud next time.'}
            </Callout>
          )}
        </>
      )}
    </div>
  );
}
