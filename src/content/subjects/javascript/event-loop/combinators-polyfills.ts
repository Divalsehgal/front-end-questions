import { codeFiles } from '../../../files';
import type { Question } from '../../../types';

const code = codeFiles('javascript', import.meta.glob<string>('../files/*', { query: '?raw', import: 'default', eager: true }));

export const combinatorsPolyfillsQuestions: Question[] = [
  {
    kind: 'quiz',
    id: 'el-q1',
    title: 'What each combinator returns',
    prompt: 'Which combinator resolves to an array of `{ status, value | reason }` objects?',
    options: ['`Promise.allSettled`', '`Promise.all`', '`Promise.any`', '`Promise.race`'],
    answer: 0,
    why: "`Promise.allSettled` resolves to one `{ status: 'fulfilled', value }` or `{ status: 'rejected', reason }` per input and never rejects. **Not Promise.all:** an array of plain values, or the first error. **Not Promise.any:** a single value, the first success (or `AggregateError`). **Not Promise.race:** a single value or error, whichever settles first.",
  },
  {
    kind: 'quiz',
    id: 'el-q2',
    title: 'Why promises beat callbacks',
    prompt: 'Which are real advantages of promises over error-first callbacks?',
    options: [
      "A promise settles exactly once, so a buggy library can't call you back twice",
      'Errors propagate down a chain to one `.catch`',
      'Composition: `Promise.all` / `race` / `any` for parallel work',
      'Promises make the code run on another thread',
    ],
    answer: [0, 1, 2],
    why: "A promise settles exactly once (later resolve/reject calls are ignored), errors skip down the chain to a single `.catch`, and combinators like `Promise.all`/`race`/`any` compose parallel work. **Not 'another thread':** promise callbacks still run on the main thread as microtasks; promises change control flow, not concurrency.",
  },
  {
    kind: 'flashcard',
    id: 'el-f1',
    title: 'The event loop',
    front: 'Explain the browser event loop: call stack, microtasks, macrotasks and rendering.',
    back: `1. Run one **task** (script, timer callback, event handler) until the **call stack** is empty.
2. Drain the **microtask queue** completely: promise callbacks, \`queueMicrotask\`, \`await\` continuations. Microtasks queued meanwhile run in the same drain.
3. Maybe **render**: \`requestAnimationFrame\` callbacks, then style, layout, paint (~every 16ms).
4. Take the next task.

So: sync → all microtasks → (render) → next timer. A chain of microtasks that never ends starves rendering.`,
  },
  {
    kind: 'flashcard',
    id: 'el-f2',
    title: 'Promise states',
    front: 'What are the states of a promise, and can a settled promise change?',
    back: `**pending** → either **fulfilled** (with a value) or **rejected** (with a reason). Fulfilled/rejected are both "settled", and settling happens **once**: later \`resolve\`/\`reject\` calls are ignored.

Resolving with another promise (or thenable) makes it *adopt* that promise's eventual state. \`.then\` callbacks always run asynchronously, even on an already-settled promise.`,
  },
  {
    kind: 'code',
    id: 'promisify',
    title: 'promisify',
    difficulty: 'easy',
    prompt: `Turn a Node-style function (last argument is \`(err, result) => void\`) into one that returns a Promise.

- resolve with \`result\`, reject with \`err\`
- pass through all arguments and keep \`this\``,
    ...code('promisify'),
  },
  {
    kind: 'code',
    id: 'promise-all-settled',
    title: 'Promise.allSettled polyfill',
    difficulty: 'easy',
    prompt:
      "Implement `Promise.allSettled`: resolve with `{ status: 'fulfilled', value }` / `{ status: 'rejected', reason }` for every input, in input order. It never rejects.",
    ...code('promise-all-settled'),
  },
  {
    kind: 'code',
    id: 'promise-any',
    title: 'Promise.any polyfill',
    difficulty: 'medium',
    prompt: `Implement \`Promise.any\`.

- resolve with the **first fulfilled** value (failures before it don't matter)
- if every input rejects, reject with an \`AggregateError\` whose \`errors\` are the reasons in **input order**
- empty input rejects with \`AggregateError\``,
    ...code('promise-any'),
  },
  {
    kind: 'code',
    id: 'promise-race',
    title: 'Promise.race polyfill',
    difficulty: 'easy',
    prompt: 'Implement `Promise.race`: settle exactly like whichever input settles first, whether it fulfils or rejects.',
    ...code('promise-race'),
  },
  {
    kind: 'code',
    id: 'run-in-series',
    title: 'Run async tasks in series',
    difficulty: 'easy',
    prompt: `Run task functions **one at a time**, in order, and collect every outcome as \`{ ok: true, value }\` or \`{ ok: false, error }\`. A failing task must not stop the rest.

Contrast with \`Promise.all(tasks.map(t => t()))\`, which starts them all at once.`,
    ...code('run-in-series'),
  },
  {
    kind: 'code',
    id: 'my-set-interval',
    title: 'setInterval using setTimeout',
    difficulty: 'easy',
    prompt: `Implement \`mySetInterval(fn, ms)\` with only \`setTimeout\`. Return a function that stops it, and make sure \`fn\` can stop the interval from inside itself.

Follow-up: why do some people prefer recursive \`setTimeout\` over \`setInterval\`? (no overlapping runs when \`fn\` is slow)`,
    ...code('my-set-interval'),
  },
  {
    kind: 'code',
    id: 'my-promise',
    title: 'Build a Promise from scratch',
    difficulty: 'hard',
    prompt: `Implement \`MyPromise\` with \`then\` (returning a **new** promise for chaining), \`catch\`, \`finally\`, and static \`resolve\` / \`reject\`.

- handlers always run **asynchronously** (as microtasks), even if the promise already settled
- returning a value from \`then\` passes it on; returning a promise waits for it; throwing rejects the next promise
- \`catch\` that returns normally **recovers** the chain
- resolve/reject only count the first time; an executor that throws rejects
- \`finally\` runs on both paths and passes the value or error through
- it must work with \`await\` (be a thenable)`,
    ...code('my-promise'),
  },
];
