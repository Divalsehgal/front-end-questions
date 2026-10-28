import { codeFiles } from '../../../files';
import type { Question } from '../../../types';

const code = codeFiles('javascript', import.meta.glob<string>('../files/*', { query: '?raw', import: 'default', eager: true }));

export const asyncPatternsQuestions: Question[] = [
  {
    kind: 'quiz',
    id: 'q-async-1',
    title: 'Microtask starvation',
    prompt: 'Why can an endless chain of microtasks freeze the page while an endless chain of `setTimeout(fn, 0)` does not?',
    options: [
      'The browser drains the whole microtask queue before it renders or takes the next task, so new microtasks keep it from ever reaching rendering',
      'Microtasks run on the main thread but timers run on a separate thread',
      'setTimeout is throttled to 1 call per second when nested',
      'Microtasks have a higher CPU priority in the OS scheduler',
    ],
    answer: 0,
    why: "After every task the event loop drains the microtask queue until it is EMPTY, including microtasks queued while draining, so an endless chain never lets the loop reach rendering or input; each `setTimeout` callback is a separate task, and the browser can render between tasks. **Not 'timers run on another thread':** timer callbacks run on the main thread too, only the countdown is elsewhere. **Not '1 call per second':** nested timers are clamped to about 4ms, not 1s. **Not OS CPU priority:** it is event-loop ordering, the OS scheduler isn't involved.",
  },
  {
    kind: 'quiz',
    id: 'q-async-2',
    title: 'Where does requestAnimationFrame run?',
    prompt: 'When does a `requestAnimationFrame` callback run?',
    options: [
      'Right before the browser paints the next frame, after tasks and microtasks of the current turn',
      'Immediately, as a microtask',
      'In the macrotask queue, in FIFO order with setTimeout',
      'On a background compositor thread',
    ],
    answer: 0,
    why: "rAF callbacks run in the 'update the rendering' step, once per frame, just before style, layout and paint, after the current task and its microtasks. **Not a microtask:** it waits for the next frame, often many milliseconds. **Not the macrotask queue with setTimeout:** it is a separate per-frame callback list, not FIFO with timers. **Not a compositor thread:** it is main-thread JS. It is paused in background tabs.",
  },
  {
    kind: 'quiz',
    id: 'q-async-3',
    title: 'Picking a Promise combinator',
    prompt: 'A dashboard loads 5 independent widgets. If some fail, the rest should still render, and each failure shows an error. Which combinator fits?',
    options: ['`Promise.allSettled`', '`Promise.all`', '`Promise.race`', '`Promise.any`'],
    answer: 0,
    why: '`Promise.allSettled` never rejects and gives a `{ status, value | reason }` for every input, so you can render the successes and show an error per failure. **Not Promise.all:** rejects on the first failure and you lose the other results. **Not Promise.race:** settles with only the first one to finish. **Not Promise.any:** resolves with only the first success (good for mirrors and fallback CDNs).',
  },
  {
    kind: 'quiz',
    id: 'q-async-4',
    title: 'Promise.any',
    prompt: 'What does `Promise.any` reject with when every input rejects?',
    options: [
      'An AggregateError whose .errors holds all reasons',
      'The first rejection reason',
      'The last rejection reason',
      'It never rejects; it resolves undefined',
    ],
    answer: 0,
    why: "`Promise.any` rejects only when every input rejects, and then with an `AggregateError` whose `.errors` lists all reasons in input order (an empty iterable rejects immediately). **Not the first or the last reason:** a single reason would hide the others, so it aggregates them. **Not 'never rejects':** that is `allSettled`.",
  },
  {
    kind: 'quiz',
    id: 'q-async-5',
    title: 'Stale search responses',
    prompt: 'Search-as-you-type: the user types "re" then "react". The "re" response arrives AFTER the "react" one and overwrites the results. Best fix?',
    options: [
      'Abort the previous request with AbortController (or ignore responses that are not the latest request id)',
      'Increase the debounce delay',
      'Use throttle instead of debounce',
      'Wrap the fetch in Promise.race',
    ],
    answer: 0,
    why: "The bug is out-of-order responses, so you must cancel or ignore stale requests: abort the previous fetch with `AbortController`, or tag each request with an id and drop responses that aren't the latest. **Not a longer debounce:** fewer requests, but two in flight can still return out of order. **Not throttle:** sends even more requests during typing. **Not Promise.race:** races promises you pass it, it can't know which response is stale. React Query and SWR handle this for you.",
  },
  {
    kind: 'quiz',
    id: 'q-async-6',
    title: 'await in a loop',
    prompt: 'What is the difference between these?',
    code: `// A
for (const id of ids) results.push(await fetchUser(id));
// B
const results = await Promise.all(ids.map(fetchUser));`,
    options: [
      'A runs requests one after another (total ≈ sum of times); B runs them concurrently (≈ the slowest one)',
      'They are identical after transpilation',
      'A is concurrent; B is sequential',
      'B keeps order but A does not',
    ],
    answer: 0,
    why: "Each `await` inside the loop pauses before starting the next request, so A is sequential (≈ sum of times), while `ids.map(fetchUser)` starts every request immediately and `Promise.all` waits for all (≈ the slowest). **Not identical after transpilation:** the semantics differ, transpilers preserve them. **Not 'A concurrent, B sequential':** backwards. **Not 'B keeps order but A doesn't':** both preserve input order. Sequential is right when requests depend on each other or you must rate-limit.",
  },
  {
    kind: 'code',
    id: 'promise-all',
    title: 'Promise.all polyfill',
    difficulty: 'medium',
    prompt: `Implement \`Promise.all\` without using \`Promise.all\` / \`Promise.allSettled\`.

- accepts any **iterable** (array, Set, generator) of values or promises
- plain values pass straight through
- results keep **input** order, not completion order
- rejects as soon as any input rejects, with that reason
- empty input resolves to \`[]\`

Bonus: type it so \`promiseAll([1, Promise.resolve('a')] as const)\` infers \`Promise<[number, string]>\` (mapped tuple + \`Awaited\`).`,
    ...code('promise-all'),
  },
  {
    kind: 'code',
    id: 'retry',
    title: 'Retry with exponential backoff + abort',
    difficulty: 'hard',
    prompt: `Call \`fn(signal)\`. If it rejects, wait and try again, up to \`retries\` extra times (at most \`retries + 1\` calls).

- wait before retry \`n\` (0-based) = \`baseDelayMs * 2 ** n\` plus random jitter of \`0..baseDelayMs\`
- resolve with the first success; after the last failure reject with **that** attempt's error
- \`opts.signal\`: if it aborts (before or during a wait), stop immediately, clear the timer and reject with \`signal.reason\`
- pass a signal to \`fn\` so it can cancel its own work too`,
    ...code('retry'),
  },
  {
    kind: 'code',
    id: 'concurrency-limit',
    title: 'Run tasks with a concurrency limit',
    difficulty: 'hard',
    prompt: `\`tasks\` are functions that **start** work when called. Run them with at most \`limit\` in flight.

- start the next task as soon as **one** finishes (a pool, not batches)
- resolve with results in **input** order
- reject with the first error, and start nothing new after a failure
- empty input resolves to \`[]\`

Real-world: upload 100 files, 4 at a time.`,
    ...code('concurrency-limit'),
  },
];
