import { codeFiles } from '../../../files';
import type { Question } from '../../../types';

const code = codeFiles('javascript', import.meta.glob<string>('../files/*', { query: '?raw', import: 'default', eager: true }));

export const scopeTrapsQuestions: Question[] = [
  {
    kind: 'output',
    id: 'cl-6',
    title: 'IIFE shadowing and the typeof trap',
    code: `const r = 'Dival';
(function () {
  const r = 'minal';
  console.log(typeof r, r);
  if (typeof r === undefined) {
    console.log('never');
  } else {
    console.log('hello world');
  }
})();`,
    why: 'The inner const r shadows the outer one inside the IIFE. typeof ALWAYS returns a string, so comparing it with the value undefined (not the string "undefined") is always false: a classic bug.',
  },
  {
    kind: 'output',
    id: 'cl-7',
    title: 'catch parameter scope',
    code: `(() => {
  let x, y;
  try {
    throw new Error();
  } catch (x) {
    (x = 1), (y = 2);
    console.log(x);
  }
  console.log(x);
  console.log(y);
})();`,
    why: 'The catch parameter x is a NEW binding scoped to the catch block, shadowing the outer x. Assigning x = 1 changes the catch-block x only; y has no shadow, so the outer y becomes 2.',
  },
  {
    kind: 'output',
    id: 'cl-8',
    title: 'var hoisting inside a nested IIFE',
    code: `var x = 23;
(function () {
  var x = 43;
  (function random() {
    console.log(x);
    var x = 21;
  })();
})();`,
    why: 'The innermost function has its own `var x`, hoisted to the top of that function (initialised to undefined). It shadows both outer x values, so the log sees undefined, not 43 or 23.',
  },
  {
    kind: 'output',
    id: 'cl-9',
    title: 'closures read the latest value; var is hoisted',
    code: `let x = 10;
function A() {
  setTimeout(function () {
    console.log(x);
    console.log(y);
  }, 0);
}
A();
x = 99;
var y = 20;`,
    why: 'The timer runs after all the sync code, and closures see the variable, not a snapshot: x is 99 by then. y is a hoisted var that has been assigned 20 by the time the timer fires, so there is no TDZ issue.',
  },
  {
    kind: 'output',
    id: 'cl-10',
    title: 'default parameters vs passing the object',
    code: `const value = { number: 10 };
const multiply = (x = { ...value }) => {
  console.log((x.number *= 2));
};
multiply();
multiply();
multiply(value);
multiply(value);
multiply({ ...value });`,
    why: 'A default parameter is evaluated on EVERY call where the arg is undefined, so each default is a fresh copy of {number: 10} → 20, 20. Passing `value` itself mutates the shared object → 20, then 40. The last call copies the now-mutated value (40) → 80.',
  },
  {
    kind: 'output',
    id: 'cl-11',
    title: 'how closures power React hooks',
    code: `const React = (function () {
  let hooks = [];
  let current = 0;
  return {
    render(Component) {
      const c = Component();
      current = 0;
      return c;
    },
    useState(initial) {
      const i = current;
      if (hooks[i] === undefined) hooks[i] = initial;
      const set = (v) => { hooks[i] = v; };
      current++;
      return [hooks[i], set];
    },
  };
})();

function Counter() {
  const [count, setCount] = React.useState(0);
  const [text, setText] = React.useState('apple');
  return { click: () => setCount(count + 1), type: setText, show: () => console.log(count, text) };
}

let App = React.render(Counter);
App.show();
App.click();
App = React.render(Counter);
App.show();
App.type('banana');
App.click();
App = React.render(Counter);
App.show();`,
    why: "State lives in the hooks array inside the closure, indexed by CALL ORDER (that's why hooks can't be conditional). Each setter closes over its own index. The second click uses the count captured during the second render (1), so it sets 2, not 3.",
  },
  {
    kind: 'flashcard',
    id: 'cl-f1',
    title: 'What is a closure?',
    front: 'What is a closure, and name three real uses beyond counters.',
    back: `A closure is a function bundled with the **lexical environment** it was created in: it keeps access to outer variables even after the outer function has returned.

- **Data privacy**: module pattern, private state (\`createCounter\`)
- **Function factories / partial application**: \`curry\`, \`partial\`, \`memoize\`, \`once\`
- **Callbacks that need context**: event handlers, timers, and React hooks (\`setState\` closes over its hook index)

Cost: everything the closure references stays alive, so a long-lived closure over big data is a memory leak.`,
  },
  {
    kind: 'flashcard',
    id: 'cl-f2',
    title: 'Stale closures in React',
    front: 'Why does `setCount(count + 1)` inside a `setInterval` in `useEffect(..., [])` get stuck at 1?',
    back: `The interval callback was created in the FIRST render and closes over that render's \`count\` (0) forever: a **stale closure**.

Fixes:
- functional update: \`setCount(c => c + 1)\` (doesn't read the captured value)
- add \`count\` to the deps (re-creates the interval each change)
- keep the latest value in a \`useRef\``,
  },
  {
    kind: 'code',
    id: 'once',
    title: 'once()',
    difficulty: 'easy',
    prompt: `Return a function that calls \`fn\` only the **first** time. Every later call returns the first result.

- keep \`this\` and the arguments of the first call
- an \`undefined\` result still counts as "called"

Real use: init code, one-time event handlers.`,
    ...code('once'),
  },
  {
    kind: 'code',
    id: 'create-counter',
    title: 'createCounter with private state',
    difficulty: 'easy',
    prompt: `\`createCounter(init)\` returns \`{ increment, decrement, reset }\`.

- \`increment()\` / \`decrement()\` return the new value; \`reset()\` returns \`init\`
- every counter is independent and its count is **private** (not a property)
- methods must work even when destructured: \`const { increment } = createCounter(1)\``,
    ...code('create-counter'),
  },
];
