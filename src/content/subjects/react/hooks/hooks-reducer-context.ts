import type { Topic } from '../../../types';

export const hooksReducerContext: Topic = {
  slug: 'hooks-reducer-context',
  title: 'Hooks: useReducer & useContext',
  questions: [
    {
      kind: 'quiz',
      id: 'h-30',
      title: 'sequential dispatches compound',
      prompt: 'After one click, what does the button show?',
      code: `function reducer(state, action) {
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
}`,
      options: ['`1`', '`2`', '`0`', '`NaN`'],
      answer: 1,
      why: "Each `dispatch` queues an action, and the reducer receives the state produced by the previous queued action, exactly like a functional updater, so two `inc` actions compound: 0→1→2. **Not 1:** that is the stale `setCount(count + 1)` pattern; reducers don't read render-time values. **Not 0:** both dispatches apply on the next render. **Not NaN:** `state.count` is a number.",
    },
    {
      kind: 'quiz',
      id: 'h-31',
      title: 'reducer returns the same state',
      prompt:
        "Dispatching `{ type: 'noop' }` (which returns the *same* state object via `default`) — does the component re-render, and does `'reducer called with noop'` log?",
      code: `function reducer(state, action) {
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
}`,
      options: [
        'Logs, and component re-renders',
        'Logs, but component does NOT re-render (same reference returned, bails out)',
        "Doesn't log, no re-render",
        'Throws an error for unhandled action type',
      ],
      answer: 1,
      why: "React calls the reducer while re-rendering `App`, so it logs; it returns the same state reference, so React bails out: no children re-render and nothing is committed. **Not 're-renders':** an identical state reference means no committed update. **Not 'doesn't log':** the reducer must run to know the result is unchanged. **Not 'throws':** `default` returns state, it doesn't throw.",
    },
    {
      kind: 'quiz',
      id: 'h-32',
      title: 'useReducer lazy init',
      prompt: "Clicking the button 3 times, how many total times does `'lazy init'` log?",
      code: `function init(initialCount) {
  console.log('lazy init');
  return { count: initialCount };
}

function reducer(state, action) {
  return action.type === 'inc' ? { count: state.count + 1 } : state;
}

function App({ start }) {
  const [state, dispatch] = useReducer(reducer, start, init);
  return <button onClick={() => dispatch({ type: 'inc' })}>{state.count}</button>;
}`,
      options: ['1', '3', '4', '0'],
      answer: 0,
      why: "The third argument `init` is called once on mount as `init(start)`; later dispatches and re-renders reuse the stored state, so it logs once. **Not 3 or 4:** init isn't called per render or per dispatch. **Not 0:** it must run to produce the initial state.",
    },
    {
      kind: 'quiz',
      id: 'h-33',
      title: 'dispatching an unknown action',
      prompt: 'What happens when the button is clicked?',
      code: `function reducer(state, action) {
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
}`,
      options: ['Renders `0` silently', 'Throws an "Unknown action" error during render', 'Renders `undefined`', 'Nothing happens, click is ignored'],
      answer: 1,
      why: "`'reset'` matches no `case`, so the reducer hits `default` and throws; React runs reducers during render, so the error surfaces as a render error (caught by an Error Boundary if one exists). **Not 'renders 0 silently':** the throw isn't swallowed. **Not undefined:** the reducer never returns. **Not 'click ignored':** dispatch always queues the action.",
    },
    {
      kind: 'quiz',
      id: 'h-34',
      title: 'three dispatches in one handler',
      prompt: 'After one click, what does the button show?',
      code: `function reducer(state, action) {
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
}`,
      options: ['`1`', '`3`', '`0`', 'Throws an error since `action` is not an object'],
      answer: 1,
      why: "Actions can be any value; each `dispatch(1)` is queued and the reducer gets the latest queued state, so the three updates compound to 3. **Not 1:** reducers don't read stale render values. **Not 0:** all three apply on the next render. **Not 'throws for non-object action':** React places no constraint on the action's shape (that is a Redux convention).",
    },
    {
      kind: 'quiz',
      id: 'h-35',
      title: 'context consumers re-render',
      prompt: 'Clicking "inc" twice — how many times does `\'Display rendered with\'` log (including mount)?',
      code: `const CountContext = createContext(0);

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
}`,
      options: ['1', '2', '3', '0'],
      answer: 2,
      why: "Every context consumer re-renders when the provider's `value` changes by `Object.is`: mount (0) + two clicks (1, 2) = 3 logs. **Not 1:** value changes re-render consumers. **Not 2:** the mount render also logs. **Not 0:** the consumer renders on mount. (Here `Display` would re-render anyway because its parent does; context matters when the consumer is memoized or deep in the tree.)",
    },
    {
      kind: 'quiz',
      id: 'h-36',
      title: 'nested providers: innermost wins',
      prompt: 'What theme value does the button render?',
      code: `const ThemeContext = createContext('light');

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
}`,
      options: ['`light`', '`dark`', '`blue`', 'Throws an error for nested providers'],
      answer: 2,
      why: "`useContext` reads the value from the nearest Provider above the component, so the inner `blue` provider wins. **Not light:** the default is used only with no provider at all. **Not dark:** the outer provider is shadowed. **Not 'throws':** nesting providers of the same context is normal (e.g. themed sections).",
    },
    {
      kind: 'quiz',
      id: 'h-37',
      title: 'useContext with no provider and no default',
      prompt:
        '`Display` is rendered with no `CountContext.Provider` anywhere above it, and `createContext()` was called with no default value. What is rendered?',
      code: `const CountContext = createContext();

function Display() {
  const count = useContext(CountContext);
  return <p>{count}</p>;
}

function App() {
  return <Display />;
}`,
      options: ['Throws an error', '`<p></p>` (renders `undefined`, i.e., nothing visible)', '`<p>null</p>`', '`<p>0</p>`'],
      answer: 1,
      why: "With no Provider above, `useContext` returns the default passed to `createContext()`; nothing was passed, so it is `undefined`, and React renders nothing for `undefined`: an empty `<p>`. **Not 'throws':** a missing provider is not an error (custom hooks often throw on purpose). **Not null:** null also renders nothing, but the value is undefined. **Not 0:** that would need `createContext(0)`.",
    },
  ],
};
