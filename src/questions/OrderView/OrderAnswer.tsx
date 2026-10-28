import { Lightbulb } from 'lucide-react';
import { Callout, inline } from '../../ui';
import { Prose } from '../../ui/code';
import { AnswerDisclosure } from '../shared';
import type { OrderQuestion } from '../../content/types';

function CorrectOrder({ items }: { items: string[] }) {
  return (
    <ol className="list-decimal space-y-1 pl-5">
      {items.map((x) => (
        <li key={x}>{inline(x)}</li>
      ))}
    </ol>
  );
}

/** The correct order and explanation, in the page but collapsed until revealed. */
export function OrderAnswer({ q, onOpen }: { q: OrderQuestion; onOpen: () => boolean }) {
  return (
    <AnswerDisclosure onOpen={onOpen}>
      <p className="font-medium">Correct order:</p>
      <CorrectOrder items={q.items} />
      <Prose text={q.why} />
    </AnswerDisclosure>
  );
}

/** After checking (or revealing): the correct order when it differs, then the verdict and explanation. */
export function OrderResult({ q, allRight, revealed }: { q: OrderQuestion; allRight: boolean; revealed: boolean }) {
  return (
    <>
      {!allRight && (
        <Callout tone="neutral" title="Correct order">
          <CorrectOrder items={q.items} />
        </Callout>
      )}
      <Callout
        role="status"
        tone={allRight ? 'success' : 'error'}
        title={allRight ? 'Correct order' : revealed ? 'Answer revealed' : 'Some steps are out of place'}
        icon={<Lightbulb size={16} aria-hidden />}
      >
        <Prose text={q.why} />
      </Callout>
    </>
  );
}
