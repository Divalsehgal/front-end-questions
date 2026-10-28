import { codeFiles } from '../../files';
import type { Topic } from '../../types';

const code = codeFiles('javascript', import.meta.glob<string>('./files/*', { query: '?raw', import: 'default', eager: true }));

export const performance: Topic = {
  slug: 'performance-memory',
  title: 'Performance & memory',
  questions: [
    {
      kind: 'quiz',
      id: 'q-perf-1',
      title: 'Debounce or throttle?',
      prompt: 'You update a "back to top" button based on scroll position. Debounce or throttle?',
      options: [
        'Throttle: you want regular updates DURING the scroll',
        'Debounce: you only care after the user stops',
        'Neither; use setInterval',
        'Debounce with 0ms',
      ],
      answer: 0,
      why: 'Throttle runs at most once per N ms while events keep coming, so the button updates regularly DURING the scroll. **Not debounce:** fires only after scrolling stops, so the button lags. **Not setInterval:** polls even when nothing scrolls. **Not debounce 0ms:** still waits for a pause in events, it just fires right after it. For visibility toggles, an IntersectionObserver on a sentinel is often better than both.',
    },
    {
      kind: 'quiz',
      id: 'q-perf-2',
      title: 'WeakMap',
      prompt: 'Why use a `WeakMap` to cache data per DOM node?',
      options: [
        'Its keys are held weakly: when the node is removed and unreferenced, the entry can be garbage-collected',
        'It is faster than Map',
        'It can be iterated in insertion order',
        'It serialises to JSON',
      ],
      answer: 0,
      why: "WeakMap keys are held weakly: once the node is removed and nothing else references it, the node and its cache entry can be garbage-collected. **Not 'faster than Map':** it isn't meaningfully faster. **Not iterable in insertion order:** WeakMaps aren't iterable at all (entries can vanish at any time). **Not JSON-serialisable:** it stringifies to `{}`. A plain Map would keep removed nodes alive forever.",
    },
    {
      kind: 'quiz',
      id: 'q-perf-3',
      title: 'Long tasks',
      prompt: 'A click handler runs a 400ms computation and the UI freezes. Which fix keeps the page responsive?',
      options: [
        'Move it to a Web Worker, or split it into chunks that yield (scheduler.yield / setTimeout) between them',
        'Wrap it in a Promise',
        'Mark the function async',
        'Use requestAnimationFrame for the whole computation',
      ],
      answer: 0,
      why: "The 400ms of CPU work blocks the main thread wherever it runs, so either move it off the thread (Web Worker) or split it into chunks that yield (`scheduler.yield()`, `setTimeout`) so input and rendering can run in between. **Not wrapping in a Promise:** the executor runs synchronously on the main thread. **Not async:** the body still runs synchronously until an await, and the work itself doesn't await. **Not rAF:** runs the whole job just before paint, delaying that frame instead. Tasks over 50ms hurt INP.",
    },
    {
      kind: 'quiz',
      id: 'q-perf-4',
      title: 'Core Web Vitals',
      prompt: 'Which metric measures how quickly the page responds to user input across the whole visit?',
      options: ['INP (Interaction to Next Paint)', 'LCP (Largest Contentful Paint)', 'CLS (Cumulative Layout Shift)', 'TTFB (Time to First Byte)'],
      answer: 0,
      why: 'INP (Interaction to Next Paint) measures the latency of interactions across the whole visit and reports roughly the worst one (good: under 200ms); it replaced FID in 2024. **Not LCP:** loading, when the largest element renders (under 2.5s). **Not CLS:** visual stability, unexpected layout shifts (under 0.1). **Not TTFB:** server response time, not user input.',
    },
    {
      kind: 'quiz',
      id: 'q-perf-5',
      title: 'Code splitting',
      prompt: 'What does a dynamic `import()` give you over a static import?',
      options: [
        'The module is fetched on demand as a separate chunk, so it is not in the initial bundle',
        'Faster execution once loaded',
        'Tree shaking (static imports cannot be tree-shaken)',
        'Synchronous loading',
      ],
      answer: 0,
      why: '`import()` returns a promise and bundlers emit the module as a separate chunk fetched on demand, so it stays out of the initial bundle (React.lazy builds on this). **Not faster execution:** once loaded the code runs the same. **Not tree shaking:** static imports are what enable tree shaking; dynamic imports make it harder. **Not synchronous:** it is always asynchronous.',
    },
    {
      kind: 'code',
      id: 'debounce',
      title: 'Debounce with cancel + flush',
      difficulty: 'medium',
      prompt: `Return a function that delays calling \`fn\` until \`wait\` ms have passed since the **last** call.

- \`fn\` runs once, with the arguments and \`this\` of the last call
- \`debounced.cancel()\` drops a pending call
- \`debounced.flush()\` runs a pending call right now (and not again later); does nothing if nothing is pending
- **TypeScript:** the debounced function must accept exactly \`fn\`'s parameters. Write the return type yourself; the type tests check it.

Follow-up to be ready for: how would you add a \`leading\` option?`,
      ...code('debounce'),
    },
    {
      kind: 'code',
      id: 'throttle',
      title: 'Throttle (leading + trailing)',
      difficulty: 'medium',
      prompt: `Let \`fn\` run at most once per \`wait\` ms, like lodash's default.

- the first call runs immediately (leading)
- calls during the window collapse; when the window ends \`fn\` runs once more with the **latest** args (trailing), which opens a new window
- if nothing was called during the window, nothing runs at its end

Follow-up: when would you choose throttle over debounce? (scroll position vs search box)`,
      ...code('throttle'),
    },
    {
      kind: 'flashcard',
      id: 'pm-f1',
      title: 'Garbage collection',
      front: 'How does JavaScript decide what memory to free?',
      back: `**Reachability**, via **mark-and-sweep**: starting from the roots (globals and the current call stack), the collector marks everything reachable by following references; anything left unmarked is swept.

So "unused" isn't enough: an object is only freed when **nothing reachable references it**. Modern engines are generational (most objects die young) and incremental, to keep pauses short.`,
    },
    {
      kind: 'flashcard',
      id: 'pm-f2',
      title: 'Memory leaks in SPAs',
      front: 'Name the four most common sources of memory leaks in a React/SPA app, and the fix for each.',
      back: `Something long-lived keeps a reference, so the GC can't collect it:

- **Event listeners** on window/document → \`removeEventListener\` in the effect cleanup
- **Timers** (\`setInterval\`) → \`clearInterval\` in cleanup
- **Pending async work** that sets state after unmount → \`AbortController\`, abort in cleanup
- **Subscriptions / global caches** (stores, sockets, Maps keyed by DOM nodes) → unsubscribe; use \`WeakMap\`

Find them with DevTools → Memory → heap snapshots (look for "Detached" DOM nodes).`,
      code: `useEffect(() => {
  const controller = new AbortController();
  fetch('/api', { signal: controller.signal })
    .then((r) => r.json())
    .then(setData)
    .catch((e) => {
      if (e.name !== 'AbortError') throw e;
    });
  window.addEventListener('resize', onResize);
  const id = setInterval(poll, 1000);
  return () => {
    controller.abort();
    window.removeEventListener('resize', onResize);
    clearInterval(id);
  };
}, []);`,
    },
    {
      kind: 'flashcard',
      id: 'pm-f3',
      title: 'Making assets load faster',
      front: "List the main techniques for loading a site's assets faster.",
      back: `- **CDN** hosting, so files are served from near the user (and cached there)
- **Compression**: Brotli or gzip for text, modern image formats (AVIF, WebP)
- **Minification** and tree-shaking of JS and CSS
- **Code splitting** and lazy loading, so you only ship what the current page needs
- **HTTP/2 or HTTP/3** multiplexing, which makes many parallel downloads cheap
- **Caching**: long \`max-age\` with content-hashed file names, so repeat visits hit the cache
- **Resource hints**: \`preconnect\` and \`preload\` for critical, late-discovered resources`,
    },
  ],
};
