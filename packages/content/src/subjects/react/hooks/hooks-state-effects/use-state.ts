import type { Question } from '../../../../types';

export const useStateQuestions: Question[] = [
  {
    kind: 'quiz',
    id: 'h-1',
    title: 'three setCount(count + 1) in one click',
    prompt: "After one click, what does the button show, and how many times does `'render'` log (including initial mount)?",
    code: `function App() {
  const [count, setCount] = useState(0);
  console.log('render', count);

  const handleClick = () => {
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
  };

  return <button onClick={handleClick}>{count}</button>;
}`,
    options: ['Shows `3`, logs twice', 'Shows `1`, logs twice', 'Shows `3`, logs 4 times', 'Shows `1`, logs 4 times'],
    answer: 1,
    why: "All three calls read the same render's `count` (0), so each queues 'set to 1', and React batches the event's updates into one re-render: shows `1`, logs twice (mount + one update). **Not shows 3:** that needs functional updates `c => c + 1`. **Not logs 4 times:** batching means one render per event, not one per `setCount`.",
  },
  {
    kind: 'quiz',
    id: 'h-2',
    title: 'functional updates chain',
    prompt: 'After one click, what does the button show?',
    code: `function App() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(c => c + 1);
    setCount(c => c + 1);
    setCount(c => c + 1);
  };

  return <button onClick={handleClick}>{count}</button>;
}`,
    options: ['`1`', '`2`', '`3`', '`0`'],
    answer: 2,
    why: 'A functional updater receives the latest queued state, so the three `c => c + 1` updates chain: 0→1→2→3, in one batched render. **Not 1:** that is the stale `setCount(count + 1)` pattern. **Not 2:** every queued updater runs, none are dropped. **Not 0:** the updates do apply on the next render.',
  },
  {
    kind: 'quiz',
    id: 'h-3',
    title: 'mutating state and setting the same object',
    prompt: 'After clicking, what is rendered?',
    code: `function App() {
  const [obj, setObj] = useState({ a: 1 });

  const handleClick = () => {
    obj.a = 5;
    setObj(obj);
  };

  return (
    <div onClick={handleClick}>
      {obj.a}
    </div>
  );
}`,
    options: ['`5`', '`1`', 'Throws an error', '`undefined`'],
    answer: 1,
    why: '`setObj(obj)` passes the same reference, and React bails out when `Object.is(old, new)` is true, so nothing re-renders and the DOM still shows `1` even though `obj.a` is 5 in memory. **Not 5:** the mutation never triggers a render, so it never reaches the DOM (until something else re-renders). **Not an error:** mutating state is a bug, not a thrown exception. **Not undefined:** `a` still exists on the object. Fix: `setObj({ ...obj, a: 5 })`.',
  },
  {
    kind: 'quiz',
    id: 'h-4',
    title: 'lazy initializer runs once',
    prompt: "Clicking the button 3 times — how many times does `'initializer ran'` log in total?",
    code: `function Counter() {
  const [count, setCount] = useState(() => {
    console.log('initializer ran');
    return 0;
  });

  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}`,
    options: ['0', '1', '3', '4'],
    answer: 1,
    why: 'Passing a function (`useState(() => ...)`) tells React to call it only on the initial render; later renders ignore it, so it logs once. **Not 0:** it must run once to produce the initial value. **Not 3 or 4:** that would happen with `useState(compute())`, which evaluates on every render (the result is just ignored).',
  },
  {
    kind: 'quiz',
    id: 'h-5',
    title: 'setState inside setTimeout (React 18)',
    prompt:
      'Click once and wait. What does the button eventually show, and are the two `setCount` calls inside `setTimeout` batched into one re-render (React 18)?',
    code: `function App() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setTimeout(() => {
      setCount(count + 1);
      setCount(count + 1);
    }, 0);
  }

  return <button onClick={handleClick}>{count}</button>;
}`,
    options: ['`2`, batched into one render', '`1`, batched into one render', '`2`, two separate renders', '`1`, two separate renders'],
    answer: 1,
    why: "React 18 batches updates everywhere (timeouts, promises, native handlers), so the two calls produce one render, and both read the same stale `count` (0) from the click's render, so the result is `1`. **Not 2:** neither call is a functional update. **Not 'two separate renders':** that was React 17 behaviour outside React event handlers.",
  },
  {
    kind: 'quiz',
    id: 'h-6',
    title: 'logging state right after setState',
    prompt: 'Starting from `count = 0`, after one click what gets logged to the console?',
    code: `function App() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(count + 1);
    console.log(count);
  };

  return <button onClick={handleClick}>{count}</button>;
}`,
    options: ['`1`', '`0`', '`undefined`', 'Nothing logs'],
    answer: 1,
    why: "`setCount` doesn't change the local `count` variable; it schedules a re-render, and this render's closure still holds `0`, so the log prints `0`. **Not 1:** the new value exists only in the next render's `count`. **Not undefined:** `count` was initialised to 0. **Not nothing:** the log runs synchronously in the handler.",
  },
  {
    kind: 'quiz',
    id: 'h-7',
    title: 'lazy initializer captures the first value',
    prompt: 'The user types `"hello"` into the input over several keystrokes. What does the `<p>` show?',
    code: `function Form() {
  const [text, setText] = useState('hi');
  const [list, setList] = useState(() => [text]);

  return (
    <div>
      <input value={text} onChange={e => setText(e.target.value)} />
      <p>{list.join(',')}</p>
    </div>
  );
}`,
    options: ['`hi`', '`hello`', '`hi,hello`', 'Empty string'],
    answer: 0,
    why: "The lazy initializer `() => [text]` runs only on mount, capturing `text` as `'hi'`; later changes to `text` never touch `list`, so it shows `hi`. **Not hello:** `list` isn't derived from `text` on each render. **Not hi,hello:** nothing ever appends to `list`. **Not empty:** the initializer did run once. If you want a derived value, compute it during render instead of storing it.",
  },
  {
    kind: 'quiz',
    id: 'h-8',
    title: 'setting the same value twice',
    prompt: 'Click the button twice. What does the button display after both clicks (mount is render 1)?',
    code: `let renderCount = 0;

function App() {
  const [count, setCount] = useState(0);
  renderCount++;

  const handleClick = () => {
    setCount(1);
    setCount(1);
  };

  return <button onClick={handleClick}>{renderCount}</button>;
}`,
    options: ['`2`', '`3`', '`4`', '`1`'],
    answer: 0,
    why: 'Click 1 changes 0→1 and both identical updates batch into one render, so `renderCount` becomes 2 and the button shows `2`. Click 2 sets the value it already has, so React bails out and commits nothing; the DOM still shows `2`. **Not 3:** React may call the component once before bailing out (so the module counter can reach 3), but that render is thrown away and never committed. **Not 4:** no click produces two renders. **Not 1:** click 1 really re-renders. Never rely on render counts.',
  },
];
