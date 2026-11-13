import type { Question } from '../../../../types';

export const layoutAndConcurrencyQuestions: Question[] = [
  {
    kind: 'quiz',
    id: 'h-38',
    title: 'render vs useLayoutEffect vs useEffect order',
    prompt: 'On mount, in what order do these three logs fire?',
    code: `function App() {
  console.log('render');

  useEffect(() => {
    console.log('useEffect');
  });

  useLayoutEffect(() => {
    console.log('useLayoutEffect');
  });

  return <div>hi</div>;
}`,
    options: [
      '`render`, `useEffect`, `useLayoutEffect`',
      '`render`, `useLayoutEffect`, `useEffect`',
      '`useLayoutEffect`, `render`, `useEffect`',
      'All fire simultaneously, order is non-deterministic',
    ],
    answer: 1,
    why: "Render runs first; then in the commit phase React applies DOM changes and synchronously runs layout effects before the browser paints; passive `useEffect`s run after paint. So: `render`, `useLayoutEffect`, `useEffect`. **Not useEffect before layout:** passive effects are deferred. **Not layout before render:** effects can't run before the component has rendered. **Not non-deterministic:** the order is guaranteed.",
  },
  {
    kind: 'quiz',
    id: 'h-39',
    title: 'measuring the DOM before paint',
    prompt: 'Why is `useLayoutEffect` used here instead of `useEffect`?',
    code: `function Tooltip() {
  const ref = useRef(null);
  const [top, setTop] = useState(0);

  useLayoutEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTop(height);
  }, []);

  return <div ref={ref} style={{ marginTop: top }}>box</div>;
}`,
    options: [
      '`useLayoutEffect` runs synchronously after DOM mutations but before the browser paints, preventing a visible flicker when adjusting layout based on measured DOM size',
      "`useLayoutEffect` runs before render, so it's faster",
      'There is no difference — this is purely stylistic',
      '`useLayoutEffect` is required whenever `useRef` is used',
    ],
    answer: 0,
    why: "`useLayoutEffect` runs after DOM mutations but before paint, so measuring and calling `setTop` re-renders synchronously and the user never sees the box in the wrong position. **Not 'runs before render':** it runs after commit, like all effects. **Not 'no difference':** with `useEffect` the first paint shows `marginTop: 0`, then a visible jump. **Not 'required with useRef':** refs work with any effect.",
  },
  {
    kind: 'quiz',
    id: 'h-40',
    title: 'setState inside useLayoutEffect',
    prompt: "What sequence of `'render'` logs appears, and does the user ever see `count = 0` painted on screen?",
    code: `function App() {
  const [count, setCount] = useState(0);

  useLayoutEffect(() => {
    if (count === 0) {
      setCount(1);
    }
  }, [count]);

  console.log('render', count);
  return <div>{count}</div>;
}`,
    options: [
      '`render 0`, `render 1` — user never sees `0` painted (layout effect updates before paint)',
      '`render 0` only — user sees `0` on screen',
      'Infinite loop of renders',
      '`render 1` only',
    ],
    answer: 0,
    why: "The update scheduled in `useLayoutEffect` is processed synchronously before the browser paints, so `render 0` and `render 1` both log but only `1` ever reaches the screen. **Not 'render 0 only, user sees 0':** that describes `useEffect`, which runs after paint. **Not an infinite loop:** the `count === 0` guard stops after one update. **Not 'render 1 only':** the initial render with 0 still runs.",
  },
  {
    kind: 'quiz',
    id: 'h-41',
    title: 'what useTransition returns',
    prompt: 'What does `useTransition()` return, and what is the correct destructuring order shown above?',
    code: `function App() {
  const [isPending, startTransition] = useTransition();
  const [tab, setTab] = useState('home');

  function selectTab(next) {
    startTransition(() => {
      setTab(next);
    });
  }

  return (
    <div>
      {isPending ? 'Loading...' : tab}
      <button onClick={() => selectTab('profile')}>Profile</button>
    </div>
  );
}`,
    options: [
      '`[isPending, startTransition]` — a boolean pending flag and a function to mark updates as non-urgent',
      '`[startTransition, isPending]` — reversed order',
      '`{ isPending, startTransition }` — an object, not an array',
      '`[isPending]` only — `startTransition` must be imported separately',
    ],
    answer: 0,
    why: '`useTransition()` returns an array `[isPending, startTransition]`: a boolean that is true while a transition is rendering, and a function that marks the updates inside it as non-urgent. **Not reversed:** the flag comes first. **Not an object:** like `useState`, it returns a tuple. **Not isPending only:** `startTransition` is in the tuple (a standalone `startTransition` export also exists, but it has no pending flag).',
  },
  {
    kind: 'quiz',
    id: 'h-42',
    title: 'what useDeferredValue does',
    prompt:
      'The user types `"a"`, then quickly `"ab"`, then `"abc"` into a controlled input that sets `query`. Broadly, what does `useDeferredValue` allow React to do?',
    code: `function List({ query }) {
  const deferredQuery = useDeferredValue(query);
  const isStale = query !== deferredQuery;

  console.log('rendering list for', deferredQuery, 'stale:', isStale);
  return <div>results for {deferredQuery}</div>;
}`,
    options: [
      'Skip re-rendering `List` entirely until typing stops',
      'Render with the latest `query` immediately for urgent updates elsewhere, while `deferredQuery` may lag behind and "catch up" in a lower-priority render, letting React keep the input responsive',
      'Debounce the `query` value using a fixed timer (e.g., 300ms)',
      'Force synchronous rendering of `List` on every keystroke',
    ],
    answer: 1,
    why: "`useDeferredValue` returns the previous value during urgent renders and schedules a lower-priority, interruptible re-render with the new one, so the input stays responsive while `deferredQuery` lags and catches up. **Not 'skip until typing stops':** it re-renders as soon as React has spare time, not after a pause. **Not a fixed-timer debounce:** there is no delay, the timing adapts to the device. **Not synchronous on every keystroke:** the opposite of its purpose.",
  },
  {
    kind: 'quiz',
    id: 'h-43',
    title: 'urgent vs transition updates',
    prompt:
      'Is the first `setCount` call (outside `startTransition`) treated as urgent or non-urgent, and does wrapping the second call in `startTransition` change what final value is eventually rendered?',
    code: `function App() {
  const [count, setCount] = useState(0);
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    setCount(c => c + 1);
    startTransition(() => {
      setCount(c => c + 1);
    });
  };

  return <button onClick={handleClick}>{count}</button>;
}`,
    options: [
      'First call is urgent (synchronous priority), second is non-urgent; final displayed value is still `count + 2` after transition settles',
      "Both calls are treated identically because they're in the same event handler",
      'Only the `startTransition` call updates state; the first call is ignored',
      '`startTransition` blocks the first update until it completes',
    ],
    answer: 0,
    why: "The first `setCount` is a normal (urgent) update; the one inside `startTransition` is a lower-priority, interruptible transition. Both still apply, so the final value is `count + 2` once the transition settles. **Not 'identical':** priority is per update, not per event handler. **Not 'first ignored':** transitions never drop other updates. **Not 'transition blocks the first':** the urgent update renders first, possibly before the transition.",
  },
  {
    kind: 'quiz',
    id: 'h-44',
    title: 'deferring an expensive child',
    prompt: 'What is the primary benefit of using `deferredText` (instead of `text` directly) as the prop to `ExpensiveList`?',
    code: `function SearchResults() {
  const [text, setText] = useState('');
  const deferredText = useDeferredValue(text);

  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <ExpensiveList text={deferredText} />
    </>
  );
}`,
    options: [
      'It guarantees `ExpensiveList` never re-renders',
      "It keeps the `<input>` responsive to typing by letting the expensive list's re-render lag behind and be interrupted, rather than blocking the keystroke-driven update",
      "It automatically caches `ExpensiveList`'s previous outputs",
      'It converts `ExpensiveList` into a Server Component',
    ],
    answer: 1,
    why: "Passing `deferredText` lets React render the input's urgent update first and re-render `ExpensiveList` in a lower-priority, interruptible pass, so typing stays responsive (wrap `ExpensiveList` in `memo` so the urgent render can skip it). **Not 'never re-renders':** it re-renders, just later. **Not caching outputs:** that is `memo`/`useMemo`. **Not a Server Component:** hooks can't change where a component runs.",
  },
];
