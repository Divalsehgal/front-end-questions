import type { Topic } from '../../types';

export const browserTopic: Topic = {
  slug: 'browser',
  title: 'Loading, rendering & the DOM',
  questions: [
    {
      kind: 'quiz',
      id: 'q-dom-1',
      title: 'Event delegation',
      prompt: 'You have a list of 1,000 rows that are added and removed often. Best way to handle clicks?',
      options: [
        'One listener on the list container, then use event.target.closest("li") to find the row',
        'One listener per row, re-attached after every render',
        'An inline onclick attribute on each row',
        'A MutationObserver that attaches listeners',
      ],
      answer: 0,
      why: "Event delegation: clicks bubble, so one listener on the container catches all rows, `event.target.closest('li')` finds which row, and rows added later just work with no re-binding. **Not one listener per row:** 1,000 listeners to attach, detach and leak on every change. **Not inline onclick:** same per-row cost, plus global-scope handlers and CSP problems. **Not a MutationObserver:** extra machinery to re-create the per-row approach. Note `focus`/`blur` don't bubble (use `focusin`/`focusout`).",
    },
    {
      kind: 'quiz',
      id: 'q-dom-2',
      title: 'Capture vs bubble',
      prompt: 'In what order do the phases of a click on a nested button happen?',
      options: [
        'Capture (window → target), target, bubble (target → window)',
        'Bubble then capture',
        'Only bubble unless you call preventDefault',
        'Target first, then capture, then bubble',
      ],
      answer: 0,
      why: "DOM events propagate in three phases: capture from `window` down to the target's parent, the target phase, then bubble back up to `window`; `{ capture: true }` listens on the way down. **Not bubble then capture:** capture always comes first. **Not 'only bubble unless preventDefault':** preventDefault cancels the default action, it doesn't affect phases. **Not target first:** the event travels down before it reaches the target.",
    },
    {
      kind: 'quiz',
      id: 'q-dom-3',
      title: 'Layout thrashing',
      prompt: 'Why is this slow?',
      code: `for (const el of items) {
  el.style.height = el.offsetHeight + 10 + 'px';
}`,
      options: [
        'Each offsetHeight read after a style write forces a synchronous layout (reflow): read and write alternate every iteration',
        'style.height is not hardware accelerated',
        'String concatenation is slow',
        'for...of is slower than a plain for loop',
      ],
      answer: 0,
      why: 'Each `offsetHeight` read after a style write forces the browser to compute layout synchronously, so the loop alternates read/write and triggers a reflow every iteration (layout thrashing). Batch reads, then writes (or write in `requestAnimationFrame`). **Not hardware acceleration:** the cost is layout, not compositing. **Not string concatenation:** trivially cheap. **Not for...of:** loop overhead is negligible next to forced layouts.',
    },
    {
      kind: 'quiz',
      id: 'q-dom-4',
      title: 'defer vs async',
      prompt: 'Which statement about `<script defer>` vs `<script async>` is correct?',
      options: [
        'Both download in parallel; defer runs in document order after parsing, async runs as soon as it downloads (order not guaranteed)',
        'async keeps order; defer does not',
        'defer blocks HTML parsing',
        'They are identical for external scripts',
      ],
      answer: 0,
      why: "Both attributes download without blocking the parser; `defer` runs after parsing finishes, in document order, while `async` runs as soon as its download completes, in whatever order they arrive. **Not 'async keeps order':** backwards. **Not 'defer blocks parsing':** that is a plain `<script>`. **Not identical:** order and timing differ. Use defer for app code, async for independent scripts like analytics; `type=\"module\"` is deferred by default.",
    },
    {
      kind: 'quiz',
      id: 'q-dom-5',
      title: 'XSS',
      prompt: 'Which is the safest way to show a user-supplied comment?',
      options: ['`element.textContent = comment`', '`element.innerHTML = comment`', '`document.write(comment)`', '`element.outerHTML = comment`'],
      answer: 0,
      why: '`textContent` creates a text node and never parses HTML, so markup in the comment is shown literally. **Not innerHTML:** parses the string, so `<img onerror>` payloads run. **Not document.write:** writes raw HTML into the document (and blows it away after load). **Not outerHTML:** parses HTML just like innerHTML. If you must render HTML, sanitise it (DOMPurify) and add a CSP.',
    },
    {
      kind: 'quiz',
      id: 'q-dom-6',
      title: 'localStorage',
      prompt: 'Why is `localStorage` a poor place for an auth token?',
      options: [
        'Any script on the page (including an XSS payload) can read it; an httpOnly cookie cannot be read by JS',
        'It is cleared on every page reload',
        'It is limited to 1KB',
        'It is sent to the server with every request',
      ],
      answer: 0,
      why: "localStorage is fully readable by any script on the origin, so a single XSS payload can exfiltrate the token; an `HttpOnly` cookie can't be read by JS at all. **Not 'cleared on reload':** it persists until removed (that is sessionStorage's tab scope, and even that survives reloads). **Not 1KB:** about 5MB per origin. **Not 'sent with every request':** that is cookies; localStorage is never sent automatically.",
    },
    {
      kind: 'order',
      id: 'br-o1',
      title: 'The rendering pipeline',
      prompt: 'Order the steps from HTML/CSS text to pixels on screen.',
      items: [
        'Parse HTML into the DOM and CSS into the CSSOM',
        'Combine them into the render tree (visible nodes only)',
        'Layout: compute size and position of every box',
        'Paint: draw text, colours, borders, shadows into layers',
        'Composite: stack the layers (transforms, opacity) on the GPU',
      ],
      why: 'Changing a layout property (width, top) re-runs layout, paint and composite. Changing colour skips layout. Changing transform/opacity can skip straight to composite, which is why animations should use them.',
    },
    {
      kind: 'quiz',
      id: 'br-q1',
      title: 'preconnect vs preload',
      prompt: 'You use Google Fonts. Which hint starts the DNS + TCP + TLS handshake early without downloading anything?',
      options: [
        '`<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>`',
        '`<link rel="preload" as="font">`',
        '`<script async>`',
        '`<link rel="prefetch">`',
      ],
      answer: 0,
      why: "`preconnect` performs DNS, TCP and TLS to an origin ahead of time without fetching anything; fonts need `crossorigin` because they are fetched in CORS mode. **Not preload as=font:** downloads a specific file, it doesn't just warm the connection. **Not script async:** about script execution, not connection setup. **Not prefetch:** fetches a resource for a future navigation at low priority.",
    },
    {
      kind: 'quiz',
      id: 'br-q2',
      title: 'Module scripts',
      prompt: 'How does `<script type="module" src="app.js">` in the head behave?',
      options: [
        'Downloads in parallel and runs after the document is parsed, like `defer`',
        'Blocks parsing until it downloads and runs',
        'Runs as soon as it downloads, like `async`',
        'Only runs after `window.onload`',
      ],
      answer: 0,
      why: 'Module scripts are deferred by default: they download in parallel and execute after parsing, in order (and get strict mode, `import`, their own scope). **Not parser-blocking:** only classic scripts without defer/async block. **Not like async:** only if you add `async` to the module. **Not after window.onload:** deferred scripts run before `DOMContentLoaded`, well before load.',
    },
    {
      kind: 'order',
      id: 'sw-o1',
      title: 'Service worker lifecycle',
      prompt: 'Order the service worker lifecycle for a first visit.',
      items: [
        "`navigator.serviceWorker.register('/sw.js')` from the page",
        '`install`: open a cache and pre-cache the app shell (`caches.open`, `cache.addAll`)',
        '`activate`: delete old caches from previous versions',
        '`fetch`: intercept requests and answer with `event.respondWith(...)`',
      ],
      why: 'A new worker waits until no tab uses the old one (or calls `skipWaiting()` / `clients.claim()`). Service workers need HTTPS (localhost is exempt) and only control pages within their scope.',
    },
    {
      kind: 'flashcard',
      id: 'sw-f1',
      title: 'Service worker caching strategies',
      front: 'Name the main service-worker caching strategies and when to use each.',
      back: `- **Cache first**: serve from the cache and fall back to the network. For versioned static assets (hashed JS/CSS, fonts, icons).
- **Network first**: try the network and fall back to the cache when offline. For HTML and API data that should be fresh.
- **Stale-while-revalidate**: serve the cached copy immediately while updating it in the background. For avatars and feeds where slightly old is fine.
- **Network only / cache only**: payments and analytics, versus a pre-cached offline page.

Remember the quota (\`navigator.storage.estimate()\`), to clean old caches on \`activate\`, and that Workbox implements all of these.`,
    },
    {
      kind: 'quiz',
      id: 'br-q3',
      title: 'IntersectionObserver in a scroll container',
      prompt: 'Your infinite list scrolls inside a `<div style="overflow:auto">`, but the observer on the sentinel never fires. Why?',
      options: [
        'With no `root`, the observer watches the viewport; pass the scrolling div as `root`',
        'IntersectionObserver only works on images',
        'The threshold must be 1',
        "Observers don't fire for elements added by React",
      ],
      answer: 0,
      why: "With no `root`, the observer measures against the viewport, not your scroll container, so `rootMargin` (and thresholds) are relative to the wrong box; pass the scrolling div as `root` (and add `rootMargin` to load early). **Not images only:** it observes any element. **Not threshold must be 1:** the default 0 fires on the first visible pixel; 1 makes it harder to trigger. **Not 'React-added elements':** observers work on any DOM node once `observe()` is called. Observers beat `onScroll` + `getBoundingClientRect`: async, no forced layout.",
    },
    {
      kind: 'flashcard',
      id: 'br-f1',
      title: 'Script loading cheat sheet',
      front: 'When do you use preconnect, preload, defer, async, dynamic import and an inline script?',
      back: `| Situation | Use |
|---|---|
| Early connection to a third-party origin | \`preconnect\` (head) |
| Critical resource discovered late (hero image, font) | \`preload\` (head) |
| Script needs the DOM, order matters | \`defer\` (head), the default choice |
| Independent script (analytics) | \`async\` (head) |
| Code the user may never need (modal, chart, route) | dynamic \`import()\` |
| Tiny critical config or one-line DOM tweak | inline \`<script>\` |`,
    },
  ],
};
