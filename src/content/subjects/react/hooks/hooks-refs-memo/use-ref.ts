import type { Question } from '../../../../types';

export const useRefQuestions: Question[] = [
  {
    kind: 'quiz',
    id: 'h-18',
    title: 'mutating a ref does not re-render',
    prompt: 'Does clicking the button cause a visible re-render, and does incrementing `renderCount.current` itself trigger a re-render?',
    code: `function App() {
  const renderCount = useRef(0);
  renderCount.current += 1;
  const [, forceRender] = useState(0);

  return (
    <button onClick={() => forceRender(n => n + 1)}>
      Renders: {renderCount.current}
    </button>
  );
}`,
    options: [
      'Click causes re-render (due to `forceRender`); mutating `.current` alone never triggers re-render',
      'Click causes re-render; mutating `.current` also triggers a re-render',
      'Click does not cause a re-render',
      '`useRef` values reset to `0` every render',
    ],
    answer: 0,
    why: "The click calls `forceRender`, a state update, which re-renders; during that render `.current` is incremented. Mutating a ref never schedules a render on its own. **Not 'mutating .current also re-renders':** refs are deliberately invisible to React's update system. **Not 'no re-render':** a state update with a new value always re-renders. **Not 'refs reset each render':** `useRef` returns the same object for the component's lifetime.",
  },
  {
    kind: 'quiz',
    id: 'h-19',
    title: 'previous value with a ref',
    prompt: 'After clicking `+` twice (count now `2`), what does the `<p>` show?',
    code: `function App() {
  const [count, setCount] = useState(0);
  const prevCount = useRef();

  useEffect(() => {
    prevCount.current = count;
  });

  return (
    <div>
      <p>Now: {count}, Before: {prevCount.current}</p>
      <button onClick={() => setCount(c => c + 1)}>+</button>
    </div>
  );
}`,
    options: ['`Now: 2, Before: 2`', '`Now: 2, Before: 1`', '`Now: 2, Before: 0`', '`Now: 2, Before: undefined`'],
    answer: 1,
    why: "Effects run after render, so each render displays `prevCount.current` from the previous render's effect, one step behind: at `count = 2` it shows `Before: 1`. **Not Before: 2:** the effect writing 2 runs after this render is painted. **Not Before: 0:** the effect after the `count = 1` render already stored 1. **Not undefined:** only the very first render shows undefined.",
  },
  {
    kind: 'quiz',
    id: 'h-20',
    title: 'DOM ref inside an effect',
    prompt: 'What logs on mount?',
    code: `function Input() {
  const inputRef = useRef(null);

  useEffect(() => {
    console.log(inputRef.current.tagName);
  }, []);

  return <input ref={inputRef} />;
}`,
    options: ['`undefined`', '`null`', '`INPUT`', 'Throws because `.current` is `null` during the effect'],
    answer: 2,
    why: "React attaches refs during the commit phase, before running effects, so `inputRef.current` is the `<input>` node and `tagName` is `'INPUT'`. **Not undefined/null:** `null` is only seen during render, before commit. **Not 'throws':** the node exists by the time effects run.",
  },
  {
    kind: 'quiz',
    id: 'h-21',
    title: 'plain variable vs ref with no re-render',
    prompt: 'Click the button 3 times. What logs each time (assume no re-render is triggered by anything else)?',
    code: `function App() {
  let count = 0;
  const countRef = useRef(count);

  const handleClick = () => {
    count += 1;
    console.log('local var:', count, 'ref:', countRef.current);
  };

  return <button onClick={handleClick}>click</button>;
}`,
    options: [
      '`local var: 1, ref: 0` all three times',
      '`local var: 1, ref: 0`, `local var: 2, ref: 0`, `local var: 3, ref: 0`',
      '`local var: 1, ref: 1`, `local var: 2, ref: 2`, `local var: 3, ref: 3`',
      'Throws an error since `count` is reassigned',
    ],
    answer: 1,
    why: "Nothing triggers a re-render, so the same `handleClick` closure (and the same `count` variable) is reused and increments 1, 2, 3, while `countRef.current` was initialised to 0 and is never written. **Not 1 all three times:** that would need a re-render that recreates `count = 0`. **Not ref 1, 2, 3:** the handler only changes the local variable. **Not 'throws':** `count` is a `let`, reassignment is fine. (After any real re-render, the local `count` would reset to 0.)",
  },
  {
    kind: 'quiz',
    id: 'h-22',
    title: 'latest value via ref in an interval',
    prompt: 'Click the button twice within the first two seconds. What does the interval log show — stale values or up-to-date values?',
    code: `function App() {
  const [count, setCount] = useState(0);
  const ref = useRef(count);
  ref.current = count;

  useEffect(() => {
    const id = setInterval(() => {
      console.log(ref.current);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}`,
    options: ['Always logs `0` (stale)', 'Logs up-to-date values because `ref.current` is reassigned every render', 'Throws an error', 'Logs `undefined`'],
    answer: 1,
    why: "Every render executes `ref.current = count`, and the interval reads `ref.current` (a property of a stable object) rather than a captured variable, so it logs the latest value. **Not 'always 0':** that is what reading `count` directly would do. **Not 'throws' or undefined:** the ref was initialised to `count`. Caveat: writing refs during render is discouraged under concurrent rendering; update the ref in an effect or use `useEffectEvent` (React 19.2).",
  },
  {
    kind: 'quiz',
    id: 'h-23',
    title: 'ref persists across renders',
    prompt: 'The button is clicked 3 times in a row. What do the three `alert` calls show?',
    code: `function App() {
  const ref = useRef(0);

  function handleClick() {
    ref.current++;
    alert(ref.current);
  }

  return <button onClick={handleClick}>Click</button>;
}`,
    options: ['`1`, `1`, `1`', '`1`, `2`, `3`', '`0`, `1`, `2`', 'Only one alert ever fires'],
    answer: 1,
    why: "A ref is the same object for the component's lifetime, and mutating `.current` persists, so the clicks alert 1, 2, 3. **Not 1, 1, 1:** that is a plain `let` reset on each render (here nothing even re-renders). **Not 0, 1, 2:** the increment happens before the alert. **Not 'one alert':** each click runs the handler.",
  },
];
