import type { Subject } from '../../types';

export const nodejs: Subject = {
  slug: 'nodejs',
  title: 'Node.js',
  blurb: "The Node event loop and its phases, nextTick vs promises, libuv's thread pool, module caching, and what blocks a server.",
  icon: 'server',
  topics: [
    {
      slug: 'event-loop',
      title: 'Event loop & libuv',
      questions: [
        {
          kind: 'order',
          id: 'nd-o1',
          title: 'Event loop phases',
          prompt: 'Order the phases of one turn of the Node.js event loop.',
          items: [
            'Timers (setTimeout / setInterval callbacks)',
            'Pending callbacks (deferred I/O callbacks)',
            'Idle, prepare (internal)',
            'Poll (retrieve new I/O; may block here waiting)',
            'Check (setImmediate callbacks)',
            "Close callbacks (e.g. socket.on('close'))",
          ],
          why: 'Between EVERY callback, Node drains process.nextTick callbacks and then the promise microtask queue. The poll phase is where Node waits for I/O when there is nothing else to do.',
        },
        {
          kind: 'quiz',
          id: 'nd-q1',
          title: 'nextTick vs promises vs timers',
          prompt: 'What does this print in Node.js?',
          code: `setTimeout(() => console.log('timeout'), 0);
setImmediate(() => console.log('immediate'));
Promise.resolve().then(() => console.log('promise'));
process.nextTick(() => console.log('nextTick'));
console.log('sync');`,
          options: [
            'sync, nextTick, promise, then timeout and immediate in either order',
            'sync, promise, nextTick, timeout, immediate',
            'nextTick, sync, promise, immediate, timeout',
            'sync, timeout, immediate, nextTick, promise',
          ],
          answer: 0,
          why: 'Order is: sync code, then the `process.nextTick` queue (Node drains it before promises), then promise microtasks, then the loop phases. In the main module `setTimeout(0)` vs `setImmediate` is non-deterministic: it depends on whether the 1ms timer is already due when the loop enters the timers phase. **Not promise before nextTick:** nextTick has priority over the promise queue. **Not nextTick before sync:** nothing async runs until the current script finishes. **Not timers before nextTick/promise:** both microtask-style queues drain before any loop phase.',
        },
        {
          kind: 'quiz',
          id: 'nd-q2',
          title: 'Inside an I/O callback',
          prompt: 'Inside an `fs.readFile` callback you schedule `setTimeout(fn, 0)` and `setImmediate(fn2)`. Which runs first?',
          options: ['setImmediate, always', 'setTimeout, always', 'It is random', 'Neither runs until the next readFile'],
          answer: 0,
          why: "An I/O callback runs in the poll phase, and the next phase is check (`setImmediate`); timers only come around on the next loop iteration, so `setImmediate` wins every time. **Not setTimeout always:** timers come after check from inside poll. **Not random:** the race only exists in the main module, where the loop hasn't started. **Not until the next readFile:** both callbacks are scheduled independently of further I/O.",
        },
        {
          kind: 'quiz',
          id: 'nd-q3',
          title: 'What uses the thread pool?',
          prompt: "Which operations run on libuv's thread pool (4 threads by default)?",
          options: ['Most `fs` file operations', '`crypto.pbkdf2` / `crypto.randomBytes` and zlib compression', '`dns.lookup`', 'TCP/HTTP socket I/O'],
          answer: [0, 1, 2],
          why: "libuv's pool handles work the OS can't do asynchronously: most `fs` operations, CPU-heavy `crypto` (`pbkdf2`, `randomBytes`, `scrypt`), zlib, and `dns.lookup` (it calls the blocking `getaddrinfo`). **Not TCP/HTTP socket I/O:** network sockets use the OS's non-blocking mechanisms (epoll/kqueue/IOCP) directly on the main loop. Raise `UV_THREADPOOL_SIZE` if many pool tasks run concurrently.",
        },
        {
          kind: 'quiz',
          id: 'nd-q4',
          title: 'Starving the event loop',
          prompt: 'Which can freeze a Node server for ALL users?',
          options: [
            '`JSON.parse` on a 50MB string, or a CPU-heavy loop in a request handler or Server Component',
            'Awaiting a slow database query',
            'Many concurrent HTTP requests waiting on the network',
            'A recursive process.nextTick chain that never ends',
          ],
          answer: [0, 3],
          why: 'Node runs your JS on one thread, so synchronous CPU work (`JSON.parse` of 50MB, a heavy loop) blocks every request, and a never-ending `process.nextTick` chain starves the loop because the nextTick queue is drained before any phase can run. **Not awaiting a slow query:** the await yields, and the loop serves others meanwhile. **Not many requests waiting on the network:** waiting on I/O is non-blocking. Offload CPU work to `worker_threads`, a queue, or another service.',
        },
        {
          kind: 'flashcard',
          id: 'nd-f1',
          title: 'Is Node single-threaded?',
          front: '"Is Node.js single-threaded?" Give the precise answer.',
          back: `**Your JavaScript runs on one thread** (one event loop, one call stack), but Node itself is not single-threaded: **libuv** keeps a thread pool for blocking work (fs, crypto, zlib, dns.lookup), the OS handles network I/O asynchronously, and \`worker_threads\` give you extra JS threads for CPU-bound tasks.

That's why Node shines at I/O-bound orchestration (APIs, BFFs, SSR streaming) and struggles with heavy computation on the main thread.`,
        },
      ],
    },
    {
      slug: 'modules-runtime',
      title: 'Modules & runtime',
      questions: [
        {
          kind: 'quiz',
          id: 'nd-q5',
          title: 'require caches modules',
          prompt: 'What does `main.js` print?',
          code: `// a.js
let x = 10;
module.exports = () => ++x;

// main.js
const f1 = require('./a');
const f2 = require('./a');
console.log(f1(), f2(), f1 === f2);`,
          options: ['11 12 true', '11 11 false', '11 11 true', '10 10 true'],
          answer: 0,
          why: 'A module is evaluated once and cached by resolved path, so both `require` calls return the same function closing over the same `x`: `f1()` gives 11, `f2()` gives 12, and `f1 === f2`. **Not 11 11 false:** that assumes two separate evaluations. **Not 11 11 true:** same function means shared `x`, so the second call sees 11 and returns 12. **Not 10 10 true:** `++x` is pre-increment, it returns the new value. This is how module-level singletons (DB pools, config) work; ESM caches the same way.',
        },
        {
          kind: 'quiz',
          id: 'nd-q6',
          title: 'CommonJS vs ESM',
          prompt: 'Which statements about CommonJS vs ES modules are true?',
          options: [
            'ESM imports are static and hoisted, which enables tree-shaking; require() is a runtime function call',
            'ESM exports are live read-only bindings; CommonJS exports a snapshot of the value',
            'ESM supports top-level await',
            'CommonJS modules load asynchronously in Node',
          ],
          answer: [0, 1, 2],
          why: 'ESM `import` is static and hoisted (so bundlers can tree-shake), its exports are live read-only bindings, and it supports top-level await; `require()` is an ordinary runtime call and CJS consumers get a copy of what was exported at that moment. **Not CJS loads async:** `require` is synchronous, which is exactly why it can\'t load async ESM. In Node mark ESM with `"type": "module"` or `.mjs`; ESM can import CJS, CJS needs `import()` (newer Node can `require()` synchronous ESM).',
        },
        {
          kind: 'flashcard',
          id: 'nd-f2',
          title: 'Node in SSR frameworks',
          front: 'Why does the Node event loop matter when you write Next.js Server Components or SSR?',
          back: `All requests on a server instance share one JS thread. Heavy synchronous work during render (big JSON transforms, sorting huge arrays, image processing) blocks **every** user's request until it finishes.

Async I/O (DB, fetch) is fine: while one request awaits, the loop serves others, and React streams HTML chunks as Suspense boundaries resolve. Rule: use Node for **orchestration**; move CPU-heavy work to background jobs, workers or another service.`,
        },
      ],
    },
  ],
};
