'use client';
import { useEffect, useState } from 'react';
import { root } from '../../dsa/data';
import { Button, Card, Kbd } from '../../ui';

// depth 1 = category, depth 2 = pattern, leaves = questions
const cards = (root.children ?? []).flatMap((cat) =>
  (cat.children ?? []).flatMap((pattern) => (pattern.children ?? []).filter((q) => q.url).map((q) => ({ q, pattern, cat }))),
);

const shuffle = <T,>(a: T[]) => {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
};

/** Flashcards: a question, you name its pattern, then reveal. Rendered in the browser only (the deck is random). */
export function DsaDrill() {
  const [deck, setDeck] = useState(() => shuffle(cards));
  const [shown, setShown] = useState(false);
  const [score, setScore] = useState({ got: 0, missed: 0 });
  const card = deck[0];

  const next = (got: boolean) => {
    const rest = deck.slice(1);
    // a missed card comes back 3 cards later; the deck refills when empty
    if (!got) rest.splice(Math.min(3, rest.length), 0, card);
    setDeck(rest.length ? rest : shuffle(cards));
    setScore((s) => (got ? { ...s, got: s.got + 1 } : { ...s, missed: s.missed + 1 }));
    setShown(false);
  };

  // Space reveals, 1 = missed, 2 = got it
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (!shown && e.code === 'Space') {
        e.preventDefault();
        setShown(true);
      } else if (shown && e.key === '1') next(false);
      else if (shown && e.key === '2') next(true);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  return (
    <div className="mx-auto max-w-xl">
      <dl className="mb-3.5 flex gap-7">
        {[
          ['Got it', score.got],
          ['Missed', score.missed],
          ['Left', deck.length],
        ].map(([label, value]) => (
          <div key={label} className="flex flex-col-reverse">
            <dt className="text-xs text-text-muted">{label}</dt>
            <dd className="font-mono text-2xl font-semibold tabular-nums">{value}</dd>
          </div>
        ))}
      </dl>
      <Card className="p-7">
        <h2 className="mb-5 text-2xl leading-tight font-semibold tracking-tight">{card.q.name}</h2>
        {/* Fixed height, so revealing never shifts the buttons. */}
        <div className="min-h-36" aria-live="polite">
          {shown ? (
            <>
              <p className="text-sm text-text-muted">{card.cat.name}</p>
              <p className="mt-0.5 mb-2 text-lg font-semibold">{card.pattern.name}</p>
              {card.pattern.memory && <p className="my-1 font-mono text-sm text-brand-strong">{card.pattern.memory}</p>}
              {card.q.memory && <p className="my-1 font-mono text-sm">{card.q.memory}</p>}
            </>
          ) : (
            <p className="text-sm text-text-muted">Name the pattern and the key idea, then reveal.</p>
          )}
        </div>
        <div className="mt-2 flex gap-2">
          {shown ? (
            <>
              <Button variant="secondary" onClick={() => next(false)}>
                Missed <Kbd>1</Kbd>
              </Button>
              <Button onClick={() => next(true)}>
                Got it <Kbd>2</Kbd>
              </Button>
            </>
          ) : (
            <Button onClick={() => setShown(true)}>
              Reveal <Kbd>Space</Kbd>
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
