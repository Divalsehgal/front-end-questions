import type { Question } from '../../../../types';

export const idsStoresRulesQuestions: Question[] = [
  {
    kind: 'quiz',
    id: 'h-45',
    title: 'useId across instances',
    prompt: 'Do the two `<Field />` instances render `<input>` elements with the same `id` value or different ones?',
    code: `function Field() {
  const id = useId();
  return (
    <div>
      <label htmlFor={id}>Name</label>
      <input id={id} />
    </div>
  );
}

function App() {
  return (
    <>
      <Field />
      <Field />
    </>
  );
}`,
    options: [
      'Same `id` value for both',
      'Different, unique `id` values for each instance',
      'Both have `id="undefined"`',
      'Throws an error for duplicate hook calls',
    ],
    answer: 1,
    why: "`useId` generates an id that is unique per component instance (and stable between server and client), so the two `Field`s get different ids. **Not 'same id':** avoiding collisions is the whole point. **Not 'undefined':** it always returns a string. **Not 'throws':** calling the same hook in two instances is normal.",
  },
  {
    kind: 'quiz',
    id: 'h-46',
    title: 'useSyncExternalStore third argument',
    prompt: 'What is the purpose of the third argument that could optionally be passed to `useSyncExternalStore` (not shown here)?',
    code: `function useWindowWidth() {
  return useSyncExternalStore(
    (callback) => {
      window.addEventListener('resize', callback);
      return () => window.removeEventListener('resize', callback);
    },
    () => window.innerWidth
  );
}

function App() {
  const width = useWindowWidth();
  return <div>{width}</div>;
}`,
    options: [
      'It provides a fallback value to use during server-side rendering / hydration (`getServerSnapshot`)',
      'It sets a debounce delay in milliseconds',
      'It specifies a custom equality comparator',
      'There is no third argument; `useSyncExternalStore` only accepts two',
    ],
    answer: 0,
    why: "The optional third argument is `getServerSnapshot`: it supplies the value during server rendering and hydration, where `window` doesn't exist, and must match on server and client. **Not a debounce delay:** the store decides when to notify. **Not an equality comparator:** React compares snapshots with `Object.is` (selectors live in the `useSyncExternalStoreWithSelector` shim). **Not 'only two arguments':** the third exists for SSR.",
  },
  {
    kind: 'quiz',
    id: 'h-47',
    title: 'why useSyncExternalStore exists',
    prompt:
      'If `store.increment()` is called from **outside** React (e.g., a browser devtools console or a non-React event), does the `<Counter>` component re-render to reflect the new value?',
    code: `let listeners = [];
let value = 0;

const store = {
  subscribe(cb) {
    listeners.push(cb);
    return () => { listeners = listeners.filter(l => l !== cb); };
  },
  getSnapshot() {
    return value;
  },
  increment() {
    value += 1;
    listeners.forEach(l => l());
  }
};

function Counter() {
  const count = useSyncExternalStore(store.subscribe, store.getSnapshot);
  return <div>{count}</div>;
}`,
    options: [
      'No, external mutations are invisible to React',
      'Yes — `useSyncExternalStore` is specifically designed to safely subscribe to external mutable stores and re-render on notification',
      'Only after the next unrelated re-render',
      'Only in React 19+, not React 18',
    ],
    answer: 1,
    why: "`useSyncExternalStore` subscribes via `store.subscribe`; when `increment()` notifies listeners, React re-reads `getSnapshot()`, sees a new value and re-renders, wherever the mutation came from, consistently under concurrent rendering. **Not 'invisible to React':** the subscription is what makes it visible. **Not 'only after an unrelated re-render':** the listener schedules the update itself. **Not 'React 19 only':** the hook shipped in React 18 (with a shim for older versions).",
  },
  {
    kind: 'quiz',
    id: 'h-48',
    title: 'conditionally calling a hook',
    prompt: '`showExtra` toggles between renders (`true` then `false`). What happens?',
    code: `function App({ showExtra }) {
  const [a, setA] = useState(0);
  if (showExtra) {
    const [b, setB] = useState(0);
  }
  const [c, setC] = useState(0);
  return <div>{a}-{c}</div>;
}`,
    options: [
      'Works fine, React handles conditional hooks automatically',
      'Violates the Rules of Hooks — calling hooks conditionally breaks hook call order, causing React to throw an error or produce inconsistent state',
      "`b`'s state silently merges into `c`",
      'Only `a` updates; `c` is frozen',
    ],
    answer: 1,
    why: "Hooks are matched to their state by call order; when `showExtra` flips to false, the second `useState` call now gets `b`'s slot and React detects the changed hook count (it throws 'Rendered fewer hooks than expected'), so this violates the Rules of Hooks. **Not 'React handles it':** React has no names for hooks, only positions. **Not 'b merges into c' or 'c is frozen':** the failure is a hook-order error (or corrupted state slots), not a defined merge. Move the condition inside the hook or into a child component.",
  },
  {
    kind: 'quiz',
    id: 'h-49',
    title: 'two instances of a custom hook',
    prompt:
      'Clicking the first button twice and the second button once — what do the two buttons show? Do `useCounter(0)` and `useCounter(100)` share any state?',
    code: `function useCounter(initial) {
  const [count, setCount] = useState(initial);
  const increment = () => setCount(c => c + 1);
  return [count, increment];
}

function App() {
  const [countA, incA] = useCounter(0);
  const [countB, incB] = useCounter(100);

  return (
    <div>
      <button onClick={incA}>{countA}</button>
      <button onClick={incB}>{countB}</button>
    </div>
  );
}`,
    options: [
      '`2` and `101` — each call to a custom hook gets its own independent state instance',
      '`2` and `102` — custom hooks share a single state instance across calls',
      "`0` and `100` — custom hooks can't update state",
      'Throws an error for calling the same hook twice',
    ],
    answer: 0,
    why: "Each custom hook call runs its own `useState`, so every call gets an independent state slot: A goes 0→2, B goes 100→101. **Not 2 and 102:** hooks share logic, never state (use context or a store to share state). **Not 0 and 100:** the setters do update. **Not 'throws':** calling the same hook twice is normal.",
  },
  {
    kind: 'quiz',
    id: 'h-50',
    title: 'stale closure in a delayed log',
    prompt:
      'Click the button, then click it again 1 second later (before the first `setTimeout` fires). What does the first `setTimeout`\'s console log print after 3 seconds — the "stale" closure value or the latest state?',
    code: `function App() {
  const [count, setCount] = useState(0);

  function increment() {
    setCount(count + 1);
    setTimeout(() => {
      console.log('after 3s, count is:', count);
    }, 3000);
  }

  return <button onClick={increment}>{count}</button>;
}`,
    options: [
      '`after 3s, count is: 0` — the stale closure captured `count` as it was at the time `increment` was called (the first click), demonstrating the classic stale closure pitfall',
      '`after 3s, count is: 2` — it always reads the latest state',
      '`after 3s, count is: 1`',
      'Throws a reference error',
    ],
    answer: 0,
    why: "Each render's `increment` closes over that render's `count`; the first click ran in the render where `count = 0`, so its timeout logs `0` three seconds later, regardless of later renders. **Not 2:** the timeout reads its own captured variable, not live state. **Not 1:** 1 is the second render's value, captured by the second click's timeout. **Not a ReferenceError:** `count` is in scope via the closure. Use a ref to read the latest value.",
  },
];
