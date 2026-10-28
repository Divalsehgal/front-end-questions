import type { Question } from '../../../../types';

export const useMemoCallbackQuestions: Question[] = [
  {
    kind: 'quiz',
    id: 'h-24',
    title: 'useMemo with a stable dependency',
    prompt: "`items` prop reference never changes across renders. Clicking the button 3 times, how many times does `'computing total'` log (including mount)?",
    code: `function App({ items }) {
  const [count, setCount] = useState(0);

  const total = useMemo(() => {
    console.log('computing total');
    return items.reduce((a, b) => a + b, 0);
  }, [items]);

  return (
    <div>
      <p>{total}</p>
      <button onClick={() => setCount(c => c + 1)}>{count}</button>
    </div>
  );
}`,
    options: ['1', '3', '4', '0'],
    answer: 0,
    why: "`useMemo` recomputes only when a dependency changes by `Object.is`; `items` keeps the same reference, so clicks re-render without recomputing: one log. **Not 3 or 4:** re-renders alone don't invalidate a memo. **Not 0:** it must compute once on mount.",
  },
  {
    kind: 'quiz',
    id: 'h-25',
    title: 'useMemo with a new array each render',
    prompt: 'Clicking "new array" once — does `\'computing\'` log again, given `[...items]` creates a new array with the same values?',
    code: `function App() {
  const [count, setCount] = useState(0);
  const [items, setItems] = useState([1, 2, 3]);

  const total = useMemo(() => {
    console.log('computing');
    return items.reduce((a, b) => a + b, 0);
  }, [items]);

  return (
    <div>
      <button onClick={() => setItems([...items])}>new array</button>
      <button onClick={() => setCount(c => c + 1)}>{count}</button>
      <p>{total}</p>
    </div>
  );
}`,
    options: [
      'No, because the values are identical',
      'Yes, because `useMemo` compares by reference (`Object.is`), and the new array is a different reference',
      'Only if `count` also changes',
      'It throws an error',
    ],
    answer: 1,
    why: "`[...items]` is a new array, and dependency comparison is `Object.is` (reference), so the memo sees a change and recomputes even though the contents are equal. **Not 'no, values identical':** React never deep-compares dependencies. **Not 'only if count changes':** `count` isn't a dependency. **Not 'throws':** this is valid code.",
  },
  {
    kind: 'quiz',
    id: 'h-26',
    title: 'React.memo without useCallback',
    prompt: "Clicking the counter button 3 times — how many times does `'Child rendered'` log (including mount)?",
    code: `function Child({ onClick }) {
  console.log('Child rendered');
  return <button onClick={onClick}>click</button>;
}
const MemoChild = React.memo(Child);

function Parent() {
  const [count, setCount] = useState(0);
  const handleClick = () => console.log('clicked');

  return (
    <div>
      <MemoChild onClick={handleClick} />
      <button onClick={() => setCount(c => c + 1)}>{count}</button>
    </div>
  );
}`,
    options: ['1', '4', '3', '0, because `MemoChild` never renders'],
    answer: 1,
    why: '`React.memo` shallow-compares props, but `handleClick` is a new function on every `Parent` render, so `onClick` always differs and `MemoChild` re-renders each time: 1 + 3 = 4. **Not 1:** that needs a stable `onClick` (`useCallback`). **Not 3:** the mount render also logs. **Not 0:** memo never skips the first render.',
  },
  {
    kind: 'quiz',
    id: 'h-27',
    title: 'React.memo with useCallback',
    prompt: "Clicking the counter button 3 times — how many times does `'Child rendered'` log (including mount)?",
    code: `function Child({ onClick }) {
  console.log('Child rendered');
  return <button onClick={onClick}>click</button>;
}
const MemoChild = React.memo(Child);

function Parent() {
  const [count, setCount] = useState(0);
  const handleClick = useCallback(() => console.log('clicked'), []);

  return (
    <div>
      <MemoChild onClick={handleClick} />
      <button onClick={() => setCount(c => c + 1)}>{count}</button>
    </div>
  );
}`,
    options: ['1', '4', '3', '2'],
    answer: 0,
    why: "`useCallback(fn, [])` returns the same function every render, so `MemoChild`'s props are shallow-equal and memo skips it: only the mount render logs. **Not 4 or 3:** those are the outcomes without a stable callback. **Not 2:** no click changes any prop of the child.",
  },
  {
    kind: 'quiz',
    id: 'h-28',
    title: 'useMemo vs useCallback return values',
    prompt: 'What is rendered when `count = 5`?',
    code: `function App() {
  const [count, setCount] = useState(0);

  const double = useMemo(() => count * 2, [count]);
  const doubleFn = useCallback(() => count * 2, [count]);

  return <div>{double} vs {typeof doubleFn}</div>;
}`,
    options: ['`10 vs function`', '`10 vs number`', '`NaN vs function`', 'Throws an error since `useCallback` needs a dependency-free function'],
    answer: 0,
    why: "`useMemo` returns the result of calling its function (`5 * 2 = 10`), while `useCallback` returns the function itself, so `typeof doubleFn` is `'function'`: `10 vs function`. **Not 'vs number':** useCallback never calls the function. **Not NaN:** `count` is a number. **Not 'throws':** useCallback accepts closures with dependencies; that is its purpose.",
  },
  {
    kind: 'quiz',
    id: 'h-29',
    title: 'useMemo with empty deps and Math.random',
    prompt: "Clicking the button 5 times — does the displayed number ever change, and how many times does `'recalculating'` log in total?",
    code: `function App() {
  const expensiveValue = useMemo(() => {
    console.log('recalculating');
    return Math.random();
  }, []);

  const [, forceRender] = useState(0);

  return (
    <button onClick={() => forceRender(n => n + 1)}>
      {expensiveValue}
    </button>
  );
}`,
    options: [
      'Number changes each click; logs 6 times',
      'Number never changes after mount; logs 1 time total',
      'Number never changes; logs 5 times',
      'Number changes only on odd clicks',
    ],
    answer: 1,
    why: "With `[]` the memo computes once on mount and every later render reuses the cached `Math.random()` value, so the number never changes and the log fires once. **Not 'changes each click; logs 6':** that is code without memoization. **Not 'logs 5':** if it re-ran, the number would also change. **Not 'odd clicks':** nothing alternates. (React may discard memo caches in rare cases, so don't use useMemo for correctness.)",
  },
];
