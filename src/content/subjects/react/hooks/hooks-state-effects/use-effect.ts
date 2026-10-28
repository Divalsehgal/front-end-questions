import type { Question } from '../../../../types';

export const useEffectQuestions: Question[] = [
  {
    kind: 'quiz',
    id: 'h-9',
    title: 'effect with no dependency array',
    prompt: 'On mount and after one click, what logs?',
    code: `function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('effect', count);
  });

  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}`,
    options: ['`effect 0` then `effect 1`', '`effect 0` only', '`effect 1` only', '`effect 0` twice'],
    answer: 0,
    why: "With no dependency array, the effect runs after every committed render: `effect 0` after mount and `effect 1` after the click's re-render. **Not 'effect 0 only':** that is `[]`. **Not 'effect 1 only':** the mount render also commits and runs effects. **Not 'effect 0 twice':** the second run sees the new render's `count` (1). (In StrictMode dev, mount effects run twice, but that is a dev-only check.)",
  },
  {
    kind: 'quiz',
    id: 'h-10',
    title: 'empty dependency array: mount and unmount',
    prompt: 'The button is clicked 3 times, then the component unmounts. What logs, in order?',
    code: `function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('mounted');
    return () => console.log('cleanup');
  }, []);

  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}`,
    options: [
      '`mounted` → `cleanup` → `mounted` (repeats per click) → `cleanup`',
      '`mounted` → `cleanup`',
      '`mounted` (once) → `cleanup` (once, on unmount)',
      '`mounted` three times, no cleanup',
    ],
    answer: 2,
    why: "With `[]` the effect has no dependencies to change, so it runs once after mount and its cleanup runs once on unmount; clicks re-render but never re-run it. **Not mounted/cleanup per click:** that is what a `[count]` dependency would do. **Not 'mounted → cleanup' immediately:** cleanup waits for unmount (StrictMode dev adds an extra mount/cleanup, but that is a dev check). **Not 'three mounts, no cleanup':** the effect doesn't re-run, and the returned cleanup always runs on unmount.",
  },
  {
    kind: 'quiz',
    id: 'h-11',
    title: 'stale count inside setInterval',
    prompt: 'After 5 seconds, what does the `<div>` show?',
    code: `function Timer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(count + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return <div>{count}</div>;
}`,
    options: ['`5`', '`1`', '`0`', 'Keeps incrementing forever past 5'],
    answer: 1,
    why: "The interval callback is created once (deps `[]`) and closes over the mount render's `count = 0`, so every tick calls `setCount(0 + 1)`: the first tick sets 1, later ticks set the same value and bail out, and it is stuck at `1`. **Not 5:** that needs `c => c + 1` or `count` in the deps. **Not 0:** the first tick does update to 1. **Not 'keeps incrementing':** the stale closure never sees a value above 0.",
  },
  {
    kind: 'quiz',
    id: 'h-12',
    title: 'setInterval with a functional update',
    prompt: 'After 5 seconds, what does the `<div>` show?',
    code: `function Timer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return <div>{count}</div>;
}`,
    options: ['`0`', '`1`', '`5`', 'Undefined behavior'],
    answer: 2,
    why: "The updater `c => c + 1` doesn't read the closed-over `count`; React passes the current state each tick, so one stale callback still increments correctly: 5 ticks → `5`. **Not 0 or 1:** those are stale-closure outcomes, and the updater avoids the stale read. **Not undefined behaviour:** this is the recommended pattern; the cleanup clears the interval on unmount.",
  },
  {
    kind: 'quiz',
    id: 'h-13',
    title: 'parent re-render, same primitive dependency',
    prompt:
      "Parent re-renders `<App userId={1} />` three times in a row with the **same** `userId` value of `1` each time. How many times does `'fetching 1'` log?",
    code: `function App({ userId }) {
  useEffect(() => {
    console.log('fetching', userId);
  }, [userId]);

  return <div>{userId}</div>;
}`,
    options: ['3', '1', '0', "Depends on parent's key prop"],
    answer: 1,
    why: "React compares each dependency with `Object.is`; `1` is `1`, so after the mount run the effect is skipped on every re-render: one log. **Not 3:** a re-render alone doesn't re-run an effect whose deps are equal. **Not 0:** effects always run after the first mount. **Not 'depends on key':** a key change would remount, but the parent passes the same props and no key change is described.",
  },
  {
    kind: 'quiz',
    id: 'h-14',
    title: 'a derived boolean as a dependency',
    prompt: "Clicking the button 6 times (count goes 0→6), how many total times (including mount) does `'effect ran'` log?",
    code: `function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('effect ran');
  }, [count > 3]);

  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}`,
    options: ['1', '2', '6', '7'],
    answer: 1,
    why: "The dependency is the boolean `count > 3`, which is `false` for 0–3 and `true` for 4–6; it changes only once (3→4), so the effect runs on mount and once more: 2. **Not 1:** the false→true flip re-runs it. **Not 6 or 7:** React compares the boolean, not `count`, so other clicks don't change the deps. (The lint rule would flag the expression, but the behaviour is well defined.)",
  },
  {
    kind: 'quiz',
    id: 'h-15',
    title: 'inline callback as an effect dependency',
    prompt: "Clicking the button 3 times — how many times does `'updated'` log (including mount)?",
    code: `function Child({ onUpdate }) {
  useEffect(() => {
    onUpdate();
  }, [onUpdate]);
  return null;
}

function Parent() {
  const [count, setCount] = useState(0);
  const handleUpdate = () => console.log('updated');

  return (
    <div>
      <Child onUpdate={handleUpdate} />
      <button onClick={() => setCount(c => c + 1)}>{count}</button>
    </div>
  );
}`,
    options: ['1', '3', '4', '0'],
    answer: 2,
    why: "`handleUpdate` is a new function on every `Parent` render, so `onUpdate` fails the `Object.is` comparison each time and the child's effect re-runs: mount + 3 clicks = 4. **Not 1:** that needs a stable reference (`useCallback`). **Not 3:** the mount run also logs. **Not 0:** effects always run after mount.",
  },
  {
    kind: 'quiz',
    id: 'h-16',
    title: 'event listener reading stale state',
    prompt: "Click the button 3 times (value becomes 3), then trigger a `resize` event. What does the console log show for `'current value:'`?",
    code: `function App() {
  const [value, setValue] = useState(0);

  useEffect(() => {
    function handleResize() {
      console.log('current value:', value);
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return <button onClick={() => setValue(v => v + 1)}>{value}</button>;
}`,
    options: ['`3`', '`0`', 'Nothing, listener was removed', '`1`'],
    answer: 1,
    why: "With `[]` the effect ran once, so `handleResize` is the function created in the mount render and its `value` is frozen at `0`; the listener is still attached, it just reads stale state. **Not 3:** the listener never sees later renders. **Not 'listener removed':** cleanup only runs on unmount. **Not 1:** there is no render where the closure captured 1. Fix: add `value` to deps, read from a ref, or use `useEffectEvent`.",
  },
  {
    kind: 'quiz',
    id: 'h-17',
    title: 'cleanup on unmount',
    prompt: 'From the first render through clicking the "hide" button, what logs in total?',
    code: `function App() {
  const [show, setShow] = useState(true);
  return (
    <div>
      {show && <Widget />}
      <button onClick={() => setShow(false)}>{'hide'}</button>
    </div>
  );
}

function Widget() {
  useEffect(() => {
    console.log('mount');
    return () => console.log('unmount');
  }, []);
  return <p>widget</p>;
}`,
    options: ['`mount` only', '`unmount` only', '`mount` then `unmount`', 'Nothing'],
    answer: 2,
    why: "`Widget` mounts on the first render (`show` is true), so its effect logs `mount`; the click sets `show` false, `Widget` leaves the tree, and React runs its cleanup: `unmount`. **Not 'mount only':** unmounting always runs cleanups. **Not 'unmount only':** the mount log already happened on the first render. **Not nothing:** effects with `[]` still run once.",
  },
];
