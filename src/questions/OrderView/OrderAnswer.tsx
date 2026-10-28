import { Lightbulb } from 'lucide-react';
import { Callout, inline } from '../../ui';
import { Prose } from '../../ui/code';
import { AnswerDisclosure } from '../shared';
import type { OrderQuestion } from '../../content/types';

function CorrectOrder({ items }: Readonly<{ items: string[] }>) {
  return (
    <ol className="list-decimal space-y-1 pl-5">
      {items.map((x) => (
        <li key={x}>{inline(x)}</li>
      ))}
    </ol>
  );
}

/** The correct order and explanation, in the page but collapsed until revealed. */
export function OrderAnswer({ q, onOpen }: Readonly<{ q: OrderQuestion; onOpen: () => boolean }>) {
  return (
    <AnswerDisclosure onOpen={onOpen}>
      <p className="font-medium">Correct order:</p>
      <CorrectOrder items={q.items} />
      <Prose text={q.why} />
    </AnswerDisclosure>
  );
}

function verdict(allRight: boolean, revealed: boolean) {
  if (allRight) return 'Correct order';
  return revealed ? 'Answer revealed' : 'Some steps are out of place';
}

/** After checking (or revealing): the correct order when it differs, then the verdict and explanation. */
export function OrderResult({ q, allRight, revealed }: Readonly<{ q: OrderQuestion; allRight: boolean; revealed: boolean }>) {
  return (
    <>
      {!allRight && (
        <Callout tone="neutral" title="Correct order">
          <CorrectOrder items={q.items} />
        </Callout>
      )}
      <Callout role="status" tone={allRight ? 'success' : 'error'} title={verdict(allRight, revealed)} icon={<Lightbulb size={16} aria-hidden />}>
        <Prose text={q.why} />
      </Callout>
    </>
  );
}
