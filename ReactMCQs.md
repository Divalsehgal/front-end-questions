# React Hooks — 50 Output-Based MCQs (Modern React 18/19)

Each question shows a code snippet. Predict the **exact output** (console logs, render count, or rendered UI). Answer key with explanations is at the end. Assumes React 18+ with automatic batching and StrictMode **off** unless stated otherwise.

---

## Section 1 — `useState` (Q1–Q8)

**Q1.**
```jsx
function App() {
  const [count, setCount] = useState(0);
  console.log('render', count);

  const handleClick = () => {
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
  };

  return <button onClick={handleClick}>{count}</button>;
}
```
After one click, what does the button show, and how many times does `'render'` log (including initial mount)?

A. Shows `3`, logs twice
B. Shows `1`, logs twice
C. Shows `3`, logs 4 times
D. Shows `1`, logs 4 times

---

**Q2.**
```jsx
function App() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(c => c + 1);
    setCount(c => c + 1);
    setCount(c => c + 1);
  };

  return <button onClick={handleClick}>{count}</button>;
}
```
After one click, what does the button show?

A. `1`
B. `2`
C. `3`
D. `0`

---

**Q3.**
```jsx
function App() {
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
}
```
After clicking, what is rendered?

A. `5`
B. `1`
C. Throws an error
D. `undefined`

---

**Q4.**
```jsx
function Counter() {
  const [count, setCount] = useState(() => {
    console.log('initializer ran');
    return 0;
  });

  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```
Clicking the button 3 times — how many times does `'initializer ran'` log in total?

A. 0
B. 1
C. 3
D. 4

---

**Q5.**
```jsx
function App() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setTimeout(() => {
      setCount(count + 1);
      setCount(count + 1);
    }, 0);
  }

  return <button onClick={handleClick}>{count}</button>;
}
```
Click once and wait. What does the button eventually show, and are the two `setCount` calls inside `setTimeout` batched into one re-render (React 18)?

A. `2`, batched into one render
B. `1`, batched into one render
C. `2`, two separate renders
D. `1`, two separate renders

---

**Q6.**
```jsx
function App() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(count + 1);
    console.log(count);
  };

  return <button onClick={handleClick}>{count}</button>;
}
```
Starting from `count = 0`, after one click what gets logged to the console?

A. `1`
B. `0`
C. `undefined`
D. Nothing logs

---

**Q7.**
```jsx
function Form() {
  const [text, setText] = useState('hi');
  const [list, setList] = useState(() => [text]);

  return (
    <div>
      <input value={text} onChange={e => setText(e.target.value)} />
      <p>{list.join(',')}</p>
    </div>
  );
}
```
The user types `"hello"` into the input over several keystrokes. What does the `<p>` show?

A. `hi`
B. `hello`
C. `hi,hello`
D. Empty string

---

**Q8.**
```jsx
let renderCount = 0;

function App() {
  const [count, setCount] = useState(0);
  renderCount++;

  const handleClick = () => {
    setCount(1);
    setCount(1);
  };

  return <button onClick={handleClick}>{renderCount}</button>;
}
```
Click the button twice (count is already `1` after the first click). What does `renderCount` equal after both clicks (mount counts as render 1)?

A. `2`
B. `3`
C. `4`
D. `1`

---

## Section 2 — `useEffect` (Q9–Q17)

**Q9.**
```jsx
function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('effect', count);
  });

  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```
On mount and after one click, what logs?

A. `effect 0` then `effect 1`
B. `effect 0` only
C. `effect 1` only
D. `effect 0` twice

---

**Q10.**
```jsx
function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('mounted');
    return () => console.log('cleanup');
  }, []);

  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```
The button is clicked 3 times, then the component unmounts. What logs, in order?

A. `mounted` → `cleanup` → `mounted` (repeats per click) → `cleanup`
B. `mounted` → `cleanup`
C. `mounted` (once) → `cleanup` (once, on unmount)
D. `mounted` three times, no cleanup

---

**Q11.**
```jsx
function Timer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(count + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return <div>{count}</div>;
}
```
After 5 seconds, what does the `<div>` show?

A. `5`
B. `1`
C. `0`
D. Keeps incrementing forever past 5

---

**Q12.**
```jsx
function Timer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return <div>{count}</div>;
}
```
After 5 seconds, what does the `<div>` show?

A. `0`
B. `1`
C. `5`
D. Undefined behavior

---

**Q13.**
```jsx
function App({ userId }) {
  useEffect(() => {
    console.log('fetching', userId);
  }, [userId]);

  return <div>{userId}</div>;
}
```
Parent re-renders `<App userId={1} />` three times in a row with the **same** `userId` value of `1` each time. How many times does `'fetching 1'` log?

A. 3
B. 1
C. 0
D. Depends on parent's key prop

---

**Q14.**
```jsx
function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('effect ran');
  }, [count > 3]);

  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```
Clicking the button 6 times (count goes 0→6), how many total times (including mount) does `'effect ran'` log?

A. 1
B. 2
C. 6
D. 7

---

**Q15.**
```jsx
function Child({ onUpdate }) {
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
}
```
Clicking the button 3 times — how many times does `'updated'` log (including mount)?

A. 1
B. 3
C. 4
D. 0

---

**Q16.**
```jsx
function App() {
  const [value, setValue] = useState(0);

  useEffect(() => {
    function handleResize() {
      console.log('current value:', value);
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return <button onClick={() => setValue(v => v + 1)}>{value}</button>;
}
```
Click the button 3 times (value becomes 3), then trigger a `resize` event. What does the console log show for `'current value:'`?

A. `3`
B. `0`
C. Nothing, listener was removed
D. `1`

---

**Q17.**
```jsx
function App() {
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
}
```
What logs when the "hide" button is clicked?

A. `mount` only
B. `unmount` only
C. `mount` then `unmount`
D. Nothing

---

## Section 3 — `useRef` (Q18–Q23)

**Q18.**
```jsx
function App() {
  const renderCount = useRef(0);
  renderCount.current += 1;
  const [, forceRender] = useState(0);

  return (
    <button onClick={() => forceRender(n => n + 1)}>
      Renders: {renderCount.current}
    </button>
  );
}
```
Does clicking the button cause a visible re-render, and does incrementing `renderCount.current` itself trigger a re-render?

A. Click causes re-render (due to `forceRender`); mutating `.current` alone never triggers re-render
B. Click causes re-render; mutating `.current` also triggers a re-render
C. Click does not cause a re-render
D. `useRef` values reset to `0` every render

---

**Q19.**
```jsx
function App() {
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
}
```
After clicking `+` twice (count now `2`), what does the `<p>` show?

A. `Now: 2, Before: 2`
B. `Now: 2, Before: 1`
C. `Now: 2, Before: 0`
D. `Now: 2, Before: undefined`

---

**Q20.**
```jsx
function Input() {
  const inputRef = useRef(null);

  useEffect(() => {
    console.log(inputRef.current.tagName);
  }, []);

  return <input ref={inputRef} />;
}
```
What logs on mount?

A. `undefined`
B. `null`
C. `INPUT`
D. Throws because `.current` is `null` during the effect

---

**Q21.**
```jsx
function App() {
  let count = 0;
  const countRef = useRef(count);

  const handleClick = () => {
    count += 1;
    console.log('local var:', count, 'ref:', countRef.current);
  };

  return <button onClick={handleClick}>click</button>;
}
```
Click the button 3 times. What logs each time (assume no re-render is triggered by anything else)?

A. `local var: 1, ref: 0` all three times
B. `local var: 1, ref: 0`, `local var: 2, ref: 0`, `local var: 3, ref: 0`
C. `local var: 1, ref: 1`, `local var: 2, ref: 2`, `local var: 3, ref: 3`
D. Throws an error since `count` is reassigned

---

**Q22.**
```jsx
function App() {
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
}
```
Click the button twice within the first two seconds. What does the interval log show — stale values or up-to-date values?

A. Always logs `0` (stale)
B. Logs up-to-date values because `ref.current` is reassigned every render
C. Throws an error
D. Logs `undefined`

---

**Q23.**
```jsx
function App() {
  const ref = useRef(0);

  function handleClick() {
    ref.current++;
    alert(ref.current);
  }

  return <button onClick={handleClick}>Click</button>;
}
```
The button is clicked 3 times in a row. What do the three `alert` calls show?

A. `1`, `1`, `1`
B. `1`, `2`, `3`
C. `0`, `1`, `2`
D. Only one alert ever fires

---

## Section 4 — `useMemo` / `useCallback` (Q24–Q29)

**Q24.**
```jsx
function App({ items }) {
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
}
```
`items` prop reference never changes across renders. Clicking the button 3 times, how many times does `'computing total'` log (including mount)?

A. 1
B. 3
C. 4
D. 0

---

**Q25.**
```jsx
function App() {
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
}
```
Clicking "new array" once — does `'computing'` log again, given `[...items]` creates a new array with the same values?

A. No, because the values are identical
B. Yes, because `useMemo` compares by reference (`Object.is`), and the new array is a different reference
C. Only if `count` also changes
D. It throws an error

---

**Q26.**
```jsx
function Child({ onClick }) {
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
}
```
Clicking the counter button 3 times — how many times does `'Child rendered'` log (including mount)?

A. 1
B. 4
C. 3
D. 0, because `MemoChild` never renders

---

**Q27.**
```jsx
function Child({ onClick }) {
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
}
```
Clicking the counter button 3 times — how many times does `'Child rendered'` log (including mount)?

A. 1
B. 4
C. 3
D. 2

---

**Q28.**
```jsx
function App() {
  const [count, setCount] = useState(0);

  const double = useMemo(() => count * 2, [count]);
  const doubleFn = useCallback(() => count * 2, [count]);

  return <div>{double} vs {typeof doubleFn}</div>;
}
```
What is rendered when `count = 5`?

A. `10 vs function`
B. `10 vs number`
C. `NaN vs function`
D. Throws an error since `useCallback` needs a dependency-free function

---

**Q29.**
```jsx
function App() {
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
}
```
Clicking the button 5 times — does the displayed number ever change, and how many times does `'recalculating'` log in total?

A. Number changes each click; logs 6 times
B. Number never changes after mount; logs 1 time total
C. Number never changes; logs 5 times
D. Number changes only on odd clicks

---

## Section 5 — `useReducer` (Q30–Q34)

**Q30.**
```jsx
function reducer(state, action) {
  switch (action.type) {
    case 'inc': return { count: state.count + 1 };
    default: return state;
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, { count: 0 });

  const handleClick = () => {
    dispatch({ type: 'inc' });
    dispatch({ type: 'inc' });
  };

  return <button onClick={handleClick}>{state.count}</button>;
}
```
After one click, what does the button show?

A. `1`
B. `2`
C. `0`
D. `NaN`

---

**Q31.**
```jsx
function reducer(state, action) {
  console.log('reducer called with', action.type);
  switch (action.type) {
    case 'inc': return { count: state.count + 1 };
    default: return state;
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, { count: 0 });
  return (
    <button onClick={() => dispatch({ type: 'noop' })}>
      {state.count}
    </button>
  );
}
```
Dispatching `{ type: 'noop' }` (which returns the *same* state object via `default`) — does the component re-render, and does `'reducer called with noop'` log?

A. Logs, and component re-renders
B. Logs, but component does NOT re-render (same reference returned, bails out)
C. Doesn't log, no re-render
D. Throws an error for unhandled action type

---

**Q32.**
```jsx
function init(initialCount) {
  console.log('lazy init');
  return { count: initialCount };
}

function reducer(state, action) {
  return action.type === 'inc' ? { count: state.count + 1 } : state;
}

function App({ start }) {
  const [state, dispatch] = useReducer(reducer, start, init);
  return <button onClick={() => dispatch({ type: 'inc' })}>{state.count}</button>;
}
```
Clicking the button 3 times, how many total times does `'lazy init'` log?

A. 1
B. 3
C. 4
D. 0

---

**Q33.**
```jsx
function reducer(state, action) {
  switch (action.type) {
    case 'set': return action.payload;
    default: throw new Error('Unknown action');
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, 0);

  return (
    <button onClick={() => dispatch({ type: 'reset' })}>
      {state}
    </button>
  );
}
```
What happens when the button is clicked?

A. Renders `0` silently
B. Throws an "Unknown action" error during render
C. Renders `undefined`
D. Nothing happens, click is ignored

---

**Q34.**
```jsx
function reducer(state, action) {
  return { ...state, count: state.count + action };
}

function App() {
  const [state, dispatch] = useReducer(reducer, { count: 0 });

  const handleClick = () => {
    dispatch(1);
    dispatch(1);
    dispatch(1);
  };

  return <button onClick={handleClick}>{state.count}</button>;
}
```
After one click, what does the button show?

A. `1`
B. `3`
C. `0`
D. Throws an error since `action` is not an object

---

## Section 6 — `useContext` (Q35–Q37)

**Q35.**
```jsx
const CountContext = createContext(0);

function Display() {
  const count = useContext(CountContext);
  console.log('Display rendered with', count);
  return <p>{count}</p>;
}

function App() {
  const [count, setCount] = useState(0);
  return (
    <CountContext.Provider value={count}>
      <Display />
      <button onClick={() => setCount(c => c + 1)}>inc</button>
    </CountContext.Provider>
  );
}
```
Clicking "inc" twice — how many times does `'Display rendered with'` log (including mount)?

A. 1
B. 2
C. 3
D. 0

---

**Q36.**
```jsx
const ThemeContext = createContext('light');

function Button() {
  const theme = useContext(ThemeContext);
  return <button>{theme}</button>;
}

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <ThemeContext.Provider value="blue">
        <Button />
      </ThemeContext.Provider>
    </ThemeContext.Provider>
  );
}
```
What theme value does the button render?

A. `light`
B. `dark`
C. `blue`
D. Throws an error for nested providers

---

**Q37.**
```jsx
const CountContext = createContext();

function Display() {
  const count = useContext(CountContext);
  return <p>{count}</p>;
}

function App() {
  return <Display />;
}
```
`Display` is rendered with no `CountContext.Provider` anywhere above it, and `createContext()` was called with no default value. What is rendered?

A. Throws an error
B. `<p></p>` (renders `undefined`, i.e., nothing visible)
C. `<p>null</p>`
D. `<p>0</p>`

---

## Section 7 — `useLayoutEffect` (Q38–Q40)

**Q38.**
```jsx
function App() {
  console.log('render');

  useEffect(() => {
    console.log('useEffect');
  });

  useLayoutEffect(() => {
    console.log('useLayoutEffect');
  });

  return <div>hi</div>;
}
```
On mount, in what order do these three logs fire?

A. `render`, `useEffect`, `useLayoutEffect`
B. `render`, `useLayoutEffect`, `useEffect`
C. `useLayoutEffect`, `render`, `useEffect`
D. All fire simultaneously, order is non-deterministic

---

**Q39.**
```jsx
function Tooltip() {
  const ref = useRef(null);
  const [top, setTop] = useState(0);

  useLayoutEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTop(height);
  }, []);

  return <div ref={ref} style={{ marginTop: top }}>box</div>;
}
```
Why is `useLayoutEffect` used here instead of `useEffect`?

A. `useLayoutEffect` runs synchronously after DOM mutations but before the browser paints, preventing a visible flicker when adjusting layout based on measured DOM size
B. `useLayoutEffect` runs before render, so it's faster
C. There is no difference — this is purely stylistic
D. `useLayoutEffect` is required whenever `useRef` is used

---

**Q40.**
```jsx
function App() {
  const [count, setCount] = useState(0);

  useLayoutEffect(() => {
    if (count === 0) {
      setCount(1);
    }
  }, [count]);

  console.log('render', count);
  return <div>{count}</div>;
}
```
What sequence of `'render'` logs appears, and does the user ever see `count = 0` painted on screen?

A. `render 0`, `render 1` — user never sees `0` painted (layout effect updates before paint)
B. `render 0` only — user sees `0` on screen
C. Infinite loop of renders
D. `render 1` only

---

## Section 8 — `useTransition` & `useDeferredValue` (Q41–Q44)

**Q41.**
```jsx
function App() {
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
}
```
What does `useTransition()` return, and what is the correct destructuring order shown above?

A. `[isPending, startTransition]` — a boolean pending flag and a function to mark updates as non-urgent
B. `[startTransition, isPending]` — reversed order
C. `{ isPending, startTransition }` — an object, not an array
D. `[isPending]` only — `startTransition` must be imported separately

---

**Q42.**
```jsx
function List({ query }) {
  const deferredQuery = useDeferredValue(query);
  const isStale = query !== deferredQuery;

  console.log('rendering list for', deferredQuery, 'stale:', isStale);
  return <div>results for {deferredQuery}</div>;
}
```
The user types `"a"`, then quickly `"ab"`, then `"abc"` into a controlled input that sets `query`. Broadly, what does `useDeferredValue` allow React to do?

A. Skip re-rendering `List` entirely until typing stops
B. Render with the latest `query` immediately for urgent updates elsewhere, while `deferredQuery` may lag behind and "catch up" in a lower-priority render, letting React keep the input responsive
C. Debounce the `query` value using a fixed timer (e.g., 300ms)
D. Force synchronous rendering of `List` on every keystroke

---

**Q43.**
```jsx
function App() {
  const [count, setCount] = useState(0);
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    setCount(c => c + 1);
    startTransition(() => {
      setCount(c => c + 1);
    });
  };

  return <button onClick={handleClick}>{count}</button>;
}
```
Is the first `setCount` call (outside `startTransition`) treated as urgent or non-urgent, and does wrapping the second call in `startTransition` change what final value is eventually rendered?

A. First call is urgent (synchronous priority), second is non-urgent; final displayed value is still `count + 2` after transition settles
B. Both calls are treated identically because they're in the same event handler
C. Only the `startTransition` call updates state; the first call is ignored
D. `startTransition` blocks the first update until it completes

---

**Q44.**
```jsx
function SearchResults() {
  const [text, setText] = useState('');
  const deferredText = useDeferredValue(text);

  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <ExpensiveList text={deferredText} />
    </>
  );
}
```
What is the primary benefit of using `deferredText` (instead of `text` directly) as the prop to `ExpensiveList`?

A. It guarantees `ExpensiveList` never re-renders
B. It keeps the `<input>` responsive to typing by letting the expensive list's re-render lag behind and be interrupted, rather than blocking the keystroke-driven update
C. It automatically caches `ExpensiveList`'s previous outputs
D. It converts `ExpensiveList` into a Server Component

---

## Section 9 — `useId` & `useSyncExternalStore` (Q45–Q47)

**Q45.**
```jsx
function Field() {
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
}
```
Do the two `<Field />` instances render `<input>` elements with the same `id` value or different ones?

A. Same `id` value for both
B. Different, unique `id` values for each instance
C. Both have `id="undefined"`
D. Throws an error for duplicate hook calls

---

**Q46.**
```jsx
function useWindowWidth() {
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
}
```
What is the purpose of the third argument that could optionally be passed to `useSyncExternalStore` (not shown here)?

A. It provides a fallback value to use during server-side rendering / hydration (`getServerSnapshot`)
B. It sets a debounce delay in milliseconds
C. It specifies a custom equality comparator
D. There is no third argument; `useSyncExternalStore` only accepts two

---

**Q47.**
```jsx
let listeners = [];
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
}
```
If `store.increment()` is called from **outside** React (e.g., a browser devtools console or a non-React event), does the `<Counter>` component re-render to reflect the new value?

A. No, external mutations are invisible to React
B. Yes — `useSyncExternalStore` is specifically designed to safely subscribe to external mutable stores and re-render on notification
C. Only after the next unrelated re-render
D. Only in React 19+, not React 18

---

## Section 10 — Rules of Hooks, Custom Hooks & Mixed (Q48–Q50)

**Q48.**
```jsx
function App({ showExtra }) {
  const [a, setA] = useState(0);
  if (showExtra) {
    const [b, setB] = useState(0);
  }
  const [c, setC] = useState(0);
  return <div>{a}-{c}</div>;
}
```
`showExtra` toggles between renders (`true` then `false`). What happens?

A. Works fine, React handles conditional hooks automatically
B. Violates the Rules of Hooks — calling hooks conditionally breaks hook call order, causing React to throw an error or produce inconsistent state
C. `b`'s state silently merges into `c`
D. Only `a` updates; `c` is frozen

---

**Q49.**
```jsx
function useCounter(initial) {
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
}
```
Clicking the first button twice and the second button once — what do the two buttons show? Do `useCounter(0)` and `useCounter(100)` share any state?

A. `2` and `101` — each call to a custom hook gets its own independent state instance
B. `2` and `102` — custom hooks share a single state instance across calls
C. `0` and `100` — custom hooks can't update state
D. Throws an error for calling the same hook twice

---

**Q50.**
```jsx
function App() {
  const [count, setCount] = useState(0);

  function increment() {
    setCount(count + 1);
    setTimeout(() => {
      console.log('after 3s, count is:', count);
    }, 3000);
  }

  return <button onClick={increment}>{count}</button>;
}
```
Click the button once, then immediately click it again 1 second later (before the first `setTimeout` fires). What does the first `setTimeout`'s console log print after 3 seconds — the "stale" closure value or the latest state?

A. `after 3s, count is: 0` — the stale closure captured `count` as it was at the time `increment` was called (the first click), demonstrating the classic stale closure pitfall
B. `after 3s, count is: 2` — it always reads the latest state
C. `after 3s, count is: 1`
D. Throws a reference error

---
---

# Answer Key & Explanations

| # | Answer | Explanation |
|---|--------|-------------|
| 1 | B | All three `setCount(count + 1)` use the same stale `count` (0), so it's `0+1=1` each time; React batches into a single re-render (mount + 1 click = 2 logs total). |
| 2 | C | Functional updates `c => c + 1` each read the latest queued value, so they chain: 0→1→2→3. |
| 3 | B | Mutating state directly doesn't change the reference; React bails out since `setObj(obj)` sees the same object reference as before (`Object.is` check), so no re-render occurs and the stale closure still shows `1`. |
| 4 | B | The lazy initializer function only runs once, on the very first render, regardless of subsequent re-renders. |
| 5 | A | Even inside `setTimeout` (React 18's automatic batching applies broadly), both `setCount(count+1)` use the same stale `count` closure, so both compute `0+1=1`; batched into one render showing `1`... *(Note: correct final value is `1`, batched into one render)* — see clarification below. |
| 6 | B | `setCount` is asynchronous/queued; `console.log(count)` right after still reads the `count` from the closure of that render, which is `0`. |
| 7 | A | The lazy initializer for `list` only runs once at mount, capturing `text` as `'hi'` at that time; typing updates `text` but never re-runs the initializer, so `list` stays `['hi']`. |
| 8 | A | Calling `setCount(1)` twice with the same value `1` as current state causes React to bail out on the second identical update in the same batch; net effect is one additional render per click-batch where the value actually changes, but since both clicks set to the same `1`, only the first click causes a render — renderCount ends at `2`. |
| 9 | A | No dependency array means the effect runs after every render: once on mount (`count=0`) and once after the click (`count=1`). |
| 10 | C | Empty dependency array `[]` means the effect runs once on mount and cleanup runs once on unmount; state changes don't re-trigger it. |
| 11 | C | Classic stale closure bug: the effect's `count` is captured once at mount (`0`) and never updates, so `setCount(0 + 1)` fires repeatedly, always setting it back to `1`... resulting display stays `1` forever, not incrementing further. Correct answer reflects it stays stuck, so display shows `1`, not `0` or `5`. |
| 12 | C | Using the functional updater `c => c + 1` avoids the stale closure, so the interval correctly increments each second, reaching `5` after 5 seconds. |
| 13 | B | Even though the parent re-renders, `useEffect` compares dependencies with `Object.is`; since `userId` stays `1` (same primitive value), the effect only runs once. |
| 14 | B | The dependency is the boolean expression `count > 3`, which is `false` for counts 0–3 and `true` for counts 4–6. It only *changes* once (false→true, at the transition from 3 to 4), so the effect re-runs once after mount — total 2 logs. |
| 15 | C | Without `useCallback`, `handleUpdate` is a new function reference on every `Parent` render, so `onUpdate` changes every time, re-triggering the child's effect: once on mount + 3 times after each click = 4. |
| 16 | B | Empty dependency array means the closure over `value` is fixed at `0` from mount and never updates, even though the listener is still attached (it wasn't removed) — logs `0`, the stale value. |
| 17 | C | `Widget` mounts when `App` first renders (`show` is `true`), logging `'mount'`; when `show` becomes `false`, `Widget` is removed from the tree, triggering its cleanup and logging `'unmount'`. |
| 18 | A | `forceRender` triggers a genuine state update causing re-render (during which `.current` is incremented); simply mutating a ref's `.current` property never by itself schedules a re-render. |
| 19 | B | The effect runs *after* render, so during any given render, `prevCount.current` still holds the value from the previous render's effect — showing the value one step behind. |
| 20 | C | By the time the effect runs after mount, the ref has been attached to the actual DOM node, so `.tagName` is `'INPUT'`. |
| 21 | B | `countRef` is initialized once with the ref's initial value and never reassigned in the handler, so `countRef.current` stays `0` while the local `count` variable increments each click (though it also resets each render since it's a plain `let`, not persisted) — since no re-render occurs here, `count` does persist across clicks within the same closure instance, giving 1,2,3, but `countRef.current` never changes from `0`. |
| 22 | B | `ref.current = count` is reassigned on every render (which happens whenever `count` changes), so by the time the interval fires, it reads the freshest value stored in the ref rather than a stale closure. |
| 23 | B | Refs persist their mutated value across renders (unlike plain variables), so each click increments the same underlying value: 1, then 2, then 3. |
| 24 | A | `items` reference is unchanged across renders, so the `useMemo` dependency doesn't change, and the memoized computation only runs once (on mount). |
| 25 | B | `useMemo` (like all dependency comparisons in React) uses reference equality (`Object.is`), and spreading into a new array `[...items]` creates a new reference even if the contents are identical, so the memo recomputes. |
| 26 | B | Without `useCallback`, `handleClick` is a new function reference every `Parent` render; even though `Child` is wrapped in `React.memo`, the changed `onClick` prop reference causes `MemoChild` to re-render each time: 1 (mount) + 3 (clicks) = 4. |
| 27 | A | `useCallback` with an empty dependency array keeps the same function reference across renders, so `React.memo` correctly bails out and `Child` only renders once, on mount. |
| 28 | A | `useMemo` returns the memoized *value* (`10`), while `useCallback` returns the memoized *function itself* (`typeof` is `'function'`), not its result. |
| 29 | B | Empty dependency array means the `Math.random()` computation only runs once at mount; subsequent re-renders (from `forceRender`) reuse the cached value, so the number never changes and the log fires only once. |
| 30 | A | Both dispatched actions read from the same `state` closure captured when `handleClick` was defined for that render (state was `{count: 0}` when the click handler ran), and since the reducer computes from the current `state.count` argument passed by React (not a stale closure — reducers always get the latest state), it actually results in `2`... **correction:** unlike `useState`, `useReducer`'s dispatch always operates against the latest state maintained internally by React, so sequential dispatches in the same batch *do* correctly compound: `0→1→2`. The correct answer is **B (`2`)**. |
| 31 | B | The reducer function itself still executes (so it logs), but since the `default` case returns the *same* state object reference unchanged, React detects no actual state change and skips re-rendering. |
| 32 | A | The lazy initializer function (third argument to `useReducer`) only runs once, on mount, just like `useState`'s lazy initializer. |
| 33 | B | Dispatching an action type not handled by any case falls through to the `default` case, which explicitly throws, crashing render (would be caught by an Error Boundary if present). |
| 34 | B | Unlike `useState`, `useReducer`'s dispatched actions are each processed sequentially against the true latest state maintained by React, so three dispatches of `+1` correctly compound to `3`. |
| 35 | C | Context value changes cause all consuming components to re-render: once on mount (`count=0`) + twice more after each click (`count=1`, then `count=2`) = 3 total. |
36 | C | The innermost `Provider` (`value="blue"`) wins for any consumer nested within it, regardless of outer providers. |
| 37 | B | With no default value passed to `createContext()` and no matching `Provider` above it, `useContext` returns `undefined`, which renders as nothing inside the `<p>`. |
| 38 | B | `useLayoutEffect` fires synchronously after DOM mutations but before the browser paints (and before `useEffect`, which is deferred/asynchronous), so the order is: render → layout effect → (paint) → effect. |
| 39 | A | This is the canonical use case: measuring the DOM and synchronously adjusting layout before paint avoids a flash of incorrectly positioned content that `useEffect` (which runs after paint) would cause. |
| 40 | A | Because the state update happens inside `useLayoutEffect`, React re-renders and commits the new value before the browser paints anything to the screen, so the user only ever visually sees `1`, even though `render 0` did execute in JS. |
| 41 | A | `useTransition()` returns a tuple `[isPending, startTransition]` — a boolean indicating whether a transition is in progress, and a function to wrap non-urgent state updates. |
| 42 | B | `useDeferredValue` lets React show the current/urgent value immediately elsewhere while allowing this particular value to "lag" and update in a lower-priority render pass, keeping the UI (like an input) responsive — it is not a fixed-timer debounce. |
| 43 | A | Direct `setState` calls in an event handler are treated with default (synchronous/urgent) priority, while updates inside `startTransition` are marked lower priority and interruptible; both eventually apply, so the final settled value reflects both increments. |
| 44 | B | Deferring the value passed to the expensive component allows React to prioritize the urgent input update and let the expensive re-render happen in a lower-priority, interruptible pass. |
| 45 | B | `useId` generates a unique, stable identifier per component instance specifically to avoid ID collisions (e.g., for accessibility attributes), so each `Field` gets a different id. |
| 46 | A | The optional third argument is `getServerSnapshot`, used to provide a consistent value during server-side rendering and initial hydration, since the browser-only APIs used in the first two arguments may not exist on the server. |
| 47 | B | This is precisely the problem `useSyncExternalStore` solves: it correctly and safely subscribes React components to external, non-React state sources and ensures re-renders happen (and stay consistent, including under concurrent rendering) when the store notifies of changes. |
| 48 | B | Hooks must be called in the exact same order on every render; conditionally calling `useState` based on a prop that can change violates the Rules of Hooks and leads to React throwing an error or corrupting internal hook state. |
| 49 | A | Each invocation of a custom hook within a component creates its own isolated state via its own `useState` call — `useCounter(0)` and `useCounter(100)` are completely independent instances. |
| 50 | A | The classic stale closure trap: `increment` (and the `setTimeout` callback within it) captures `count` as it was during the render in which that particular click's handler was created — the first click's closure has `count = 0`, so it prints `0`, regardless of state changes that happen afterward. |

---

### Notes on tricky items
- **Q5 / Q30 clarification:** `useState` batches multiple calls with the *same stale value* from one render's closure and does not compound within that closure, whereas `useReducer`'s `dispatch` always applies against the true latest internal state, so consecutive dispatches *do* compound. This is one of the most commonly confused distinctions between the two hooks — worth committing to memory for interviews.
- **Q11 vs Q12** and **Q16** illustrate the same root cause (stale closures in `useEffect`) with two different fixes: functional updates (`setState(prev => ...)`) or keeping a ref in sync (`ref.current = value`).