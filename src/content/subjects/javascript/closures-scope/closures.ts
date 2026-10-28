import { codeFiles } from '../../../files';
import type { Question } from '../../../types';

const code = codeFiles('javascript', import.meta.glob<string>('../files/*', { query: '?raw', import: 'default', eager: true }));

export const closuresQuestions: Question[] = [
  {
    kind: 'output',
    id: 'cl-1',
    title: 'var vs let in a loop with timers',
    code: `for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log('var', i));
}
for (let j = 0; j < 3; j++) {
  setTimeout(() => console.log('let', j));
}`,
    why: 'var has ONE binding for the whole loop; by the time timers fire it is 3. let creates a fresh binding per iteration. Fix var without let: IIFE (function (t) {...})(i), or setTimeout(console.log, 0, "var", i), or .bind(null, i).',
  },
  {
    kind: 'output',
    id: 'cl-2',
    title: 'independent counters; destructured method',
    code: `function makeCounter() {
  let count = 0;
  return { inc: () => ++count, get: () => count };
}
const a = makeCounter();
const b = makeCounter();
a.inc();
a.inc();
b.inc();
console.log(a.get(), b.get());
const { inc } = a;
inc();
console.log(a.get());`,
    why: 'Each makeCounter call creates its own `count`. inc is an arrow that closes over `count`, it never used `this`, so destructuring it does NOT break it (contrast with this-binding drills).',
  },
  {
    kind: 'output',
    id: 'cl-3',
    title: 'closure captures the variable, not the value',
    code: `let x = 1;
function show() {
  console.log(x);
}
setTimeout(show);
x = 2;`,
    why: 'A closure holds a live reference to the variable binding. By the time the timer runs, x is 2.',
  },
  {
    kind: 'output',
    id: 'cl-4',
    title: 'array of functions built with var',
    code: `var fns = [];
for (var i = 0; i < 3; i++) fns.push(() => i * 10);
console.log(fns[0](), fns[2]());`,
    why: 'Same single `var i` shared by all three arrows; after the loop i === 3, so every function returns 30.',
  },
  {
    kind: 'output',
    id: 'cl-5',
    title: 'lexical, not dynamic, scope',
    code: `const name = 'module';
function outer() {
  const name = 'outer';
  return function inner() {
    return name;
  };
}
function caller() {
  const name = 'caller';
  return outer()();
}
console.log(caller(), name);`,
    why: 'A function sees variables from where it was WRITTEN (outer), not from where it was CALLED (caller). JS has lexical scope.',
  },
  {
    kind: 'quiz',
    id: 'q-scope-1',
    title: 'Closure memory leak',
    prompt: 'Which pattern most commonly leaks memory in a long-lived SPA?',
    options: [
      'A listener/interval added on mount that closes over large data and is never removed on unmount',
      'Using const instead of let',
      'Declaring functions inside other functions',
      'Returning arrow functions from hooks',
    ],
    answer: 0,
    why: "A closure keeps alive everything it references; if a long-lived object (`window`, `document`, a store, an interval) still holds the listener after unmount, the component's data and detached DOM can never be collected. Clean up in the effect's return or with an `AbortController` signal. **Not const vs let:** declaration keyword has no effect on reachability. **Not nested functions:** they are collected normally once nothing references them. **Not returning arrows from hooks:** fine unless something long-lived keeps holding them.",
  },
  {
    kind: 'quiz',
    id: 'q-scope-4',
    title: 'TDZ',
    prompt: 'Which line throws?',
    code: `console.log(typeof undeclaredThing); // 1
console.log(typeof later);           // 2
let later = 1;`,
    options: ['Line 2 (ReferenceError: TDZ)', 'Line 1', 'Both', 'Neither, both print "undefined"'],
    answer: 0,
    why: "`typeof` on a name that was never declared is safe and gives `'undefined'`, but `later` IS declared: `let` bindings are hoisted and uninitialized until the declaration runs (the TDZ), so even `typeof later` throws ReferenceError. **Not line 1:** undeclared names are the one case typeof protects. **Not both:** line 1 never throws. **Not neither:** TDZ access throws even through typeof.",
  },
  {
    kind: 'quiz',
    id: 'q-scope-5',
    title: 'Module scope',
    prompt: 'In an ES module (`type="module"`), what is top-level `this`?',
    options: ['`undefined`', '`window`', '`module.exports`', 'The module namespace object'],
    answer: 0,
    why: "ES modules are always strict and their top-level code isn't called as a method of anything, so top-level `this` is `undefined`. **Not window:** that is a classic (non-module) browser script. **Not module.exports:** that is CommonJS top-level `this`. **Not the namespace object:** you get it via `import * as ns`, never via `this`.",
  },
  {
    kind: 'code',
    id: 'curry',
    title: 'Curry',
    difficulty: 'easy',
    prompt: `\`curry(fn)\` keeps collecting arguments until it has \`fn.length\` of them, then calls \`fn\`.

\`\`\`
const add3 = curry((a, b, c) => a + b + c);
add3(1)(2)(3) === add3(1, 2)(3) === add3(1)(2, 3) === add3(1, 2, 3) === 6
\`\`\`

- each partial is independent and reusable
- preserve \`this\` from the final call`,
    ...code('curry'),
  },
  {
    kind: 'code',
    id: 'memoize',
    title: 'Memoize with resolver',
    difficulty: 'easy',
    prompt: `Cache results of \`fn\`.

- default key: the **first** argument (Map semantics, so objects by reference)
- \`resolver(...args)\` can build a custom key
- a cached \`undefined\` result still counts as cached
- expose the cache as \`.cache\` (a \`Map\`) so callers can clear it`,
    ...code('memoize'),
  },
];
