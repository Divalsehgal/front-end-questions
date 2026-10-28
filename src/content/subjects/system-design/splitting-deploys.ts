import { codeFiles } from '../../files';
import type { Topic } from '../../types';

const code = codeFiles('system-design', import.meta.glob<string>('./files/*', { query: '?raw', import: 'default', eager: true }));

export const splittingDeploys: Topic = {
  slug: 'splitting-deploys',
  title: 'Code splitting & deploys',
  questions: [
    {
      kind: 'flashcard',
      id: 'dl-f8',
      title: 'Route-level code splitting',
      front: "What does `React.lazy(() => import('./pages/Checkout'))` do at build time and at run time?",
      back: `**Build time:** every dynamic \`import()\` is a split point. The bundler puts that module (and code only it uses) into its own chunk with a hashed name, and code shared by several chunks into shared chunks.

**Run time:** the chunk is fetched the first time the component renders. Until it arrives the component **suspends**, and the nearest \`<Suspense>\` boundary shows its fallback. Once loaded, the module stays in memory for the life of the page.

Splitting by route is the usual default: users download only the pages they open, so the entry stays small.`,
    },
    {
      kind: 'flashcard',
      id: 'dl-f9',
      title: 'A vendor chunk',
      front: 'Why put libraries like `react` and `react-dom` into their own chunk, and what is the trade-off?',
      back: `Libraries change far less often than your code. In a separate chunk, their file name (hash) stays the same across deploys that only touch your code, so returning users keep them cached.

Vite doesn't create a vendor chunk by default; you opt in with \`build.rollupOptions.output.manualChunks\` (webpack: \`optimization.splitChunks\`).

Trade-offs: one big vendor chunk changes whenever **any** dependency is upgraded, and it may include libraries a page never uses. Splitting it into many chunks means more requests. Group by how often things change and where they're used.`,
    },
    {
      kind: 'flashcard',
      id: 'dl-f10',
      title: 'modulepreload',
      front: 'What problem does `<link rel="modulepreload" href="/assets/Checkout-x1.js">` solve?',
      back: `Without it, chunks load in a **waterfall**: download the entry → run it → discover \`import('./Checkout-x1.js')\` → download that → discover its imports → download those.

\`modulepreload\` tells the browser up front to fetch (and parse) a module, so chunks the page will certainly need download **in parallel** with the entry. Vite adds these links for the entry's static imports, and its preload helper fetches a lazy chunk's dependencies together with it. A prerendered page can also list its own route's chunks in its HTML.

Use it for what the page needs now; for the *next* likely route, prefetch when idle or on hover instead.`,
    },
    {
      kind: 'flashcard',
      id: 'dl-f11',
      title: 'Version skew',
      front: 'What is version skew, and what two forms does it take after a deploy?',
      back: `An open tab keeps running the JavaScript it loaded, possibly for hours, while the server has moved on to a new deploy. Nothing breaks until the old code needs something from the server:

1. **Assets:** the old code asks for a lazy chunk by its old hashed name. If the deploy removed old files, it gets a 404 and the import fails (webpack \`ChunkLoadError\`; native \`import()\`: a \`TypeError\` such as "Failed to fetch dynamically imported module").
2. **API:** the old code calls the new backend with old assumptions (a renamed field, a removed endpoint).

Code already loaded keeps working, because it is in memory.`,
    },
    {
      kind: 'flashcard',
      id: 'dl-f12',
      title: 'Fixes for version skew, by layer',
      front: 'List the defences against chunk load failures after a deploy, and where each one lives.',
      back: `- **Hosting:** keep old hashed assets for a while instead of deleting them (they never collide with new names), or use the platform's support for it, e.g. Vercel Skew Protection. Prevents the 404.
- **Detection:** poll a \`version.json\` (or read a version header) and make the next navigation a full page load, so users move over before they hit an old chunk.
- **Loader:** retry a failed \`import()\` a couple of times. This helps with network blips; it can't fix a file that no longer exists.
- **Global handler:** on \`vite:preloadError\` (webpack: a \`ChunkLoadError\`), reload once, guarded by a timestamp in \`sessionStorage\` so a broken deploy can't cause a reload loop.
- **UI:** an error boundary around the routes shows "A new version is available — Refresh" instead of a blank screen.`,
    },
    {
      kind: 'flashcard',
      id: 'dl-f13',
      title: 'Expand → migrate → contract',
      front: 'How do you change an API field (say `price` → `amount`) without breaking tabs still running old code?',
      back: `1. **Expand:** the backend returns **both** \`price\` and \`amount\` (and accepts both).
2. **Migrate:** deploy the frontend that uses only \`amount\`.
3. **Wait** until old clients are gone: old tabs refreshed, mobile apps updated. Logs of an app-version header show when.
4. **Contract:** remove \`price\` from the backend.

At every moment, any client version still in use talks to a backend that understands it. The same pattern applies to database columns.`,
    },
    {
      kind: 'quiz',
      id: 'dl-q7',
      title: 'Old tab, new route',
      prompt:
        "A user has had your SPA open for two hours. You deploy, and the deploy deletes the previous build's files. They now click a route they haven't opened before, which is a lazy chunk. What happens?",
      options: [
        'The old entry code requests the chunk by its old hashed name, gets a 404, and the dynamic import rejects',
        'The browser notices the deploy and loads the new chunk instead',
        'The page reloads automatically with the new version',
        'Nothing visible: the CDN serves the new chunk under the old name',
      ],
      answer: 0,
      why: 'The running entry only knows the file names from its own build, so it asks for `Page-<oldhash>.js`, which no longer exists. The import rejects (`ChunkLoadError` in webpack, a `TypeError` for native `import()`), and without handling the user sees an error or a blank area. **Not "the browser notices":** browsers know nothing about deploys. **Not "reloads automatically":** only if you wrote a handler for it. **Not "the CDN serves the new chunk":** different contents live under a different name; nothing maps old names to new files.',
    },
    {
      kind: 'quiz',
      id: 'dl-q8',
      title: 'Old tab, visited route',
      prompt: 'Same situation, but the user goes back to a page they already opened before the deploy. What happens?',
      options: [
        'It works: that module was already loaded and stays in memory for the life of the page',
        'It fails with a 404 like any other chunk',
        'It loads the new version of the page',
        'It works only if the asset is still in the disk cache',
      ],
      answer: 0,
      why: "Once a module has been loaded, the page keeps it in its module map; importing it again doesn't touch the network. That's why old tabs mostly keep working after a deploy and only break on code they haven't loaded yet. **Not 404:** there's no request. **Not \"the new version\":** the tab keeps running its old code. **Not \"only if in the disk cache\":** the module is already in memory, so the HTTP cache doesn't matter.",
    },
    {
      kind: 'quiz',
      id: 'dl-q9',
      title: 'Why retrying is not enough',
      prompt: 'A lazy import fails because a deploy deleted the old chunk. Why does a retry wrapper around `import()` not fix it?',
      options: [
        'Every retry asks for the same old URL, which still returns 404; only loading the new HTML gives the code the new file names',
        'Retries are not allowed for dynamic imports',
        'The retry succeeds but loads a corrupted file',
        'It does fix it, as long as there are at least three retries',
      ],
      answer: 0,
      why: 'The URL is baked into the old code, and the file behind it is gone, so retrying repeats the same failure. Retries help with transient network errors; after a deploy you need new HTML (a reload) or old assets kept on the server. **Not "not allowed":** you can call `import()` again. **Not "corrupted file":** there is no file. **Not "three retries":** the number doesn\'t matter.',
    },
    {
      kind: 'quiz',
      id: 'dl-q10',
      title: 'The reload loop guard',
      prompt:
        'Your `vite:preloadError` handler calls `location.reload()`. Why store a timestamp in `sessionStorage` and skip the reload if the last one was a few seconds ago?',
      options: [
        'If the chunk is missing even in the new build (a broken deploy), each reload would fail again and reload forever',
        'Browsers block more than one reload per minute',
        "To keep the user's form data across reloads",
        'sessionStorage makes the reload faster',
      ],
      answer: 0,
      why: 'A reload fixes the normal case (new HTML → new chunk names). If the new build itself is broken, the error repeats right after the reload, and without a guard the page reloads endlessly. `sessionStorage` survives a reload in the same tab, so the next page load can see that it just tried and let the error reach an error boundary instead. **Not "browsers block reloads":** they don\'t. **Not "form data":** the timestamp saves nothing for the user. **Not "faster":** it doesn\'t affect loading.',
    },
    {
      kind: 'quiz',
      id: 'dl-q11',
      title: 'Same failure, different messages',
      prompt: 'Which of these errors mean "a code-split chunk failed to load"? Select all that apply.',
      options: [
        'ChunkLoadError: Loading chunk 42 failed. (webpack)',
        'TypeError: Failed to fetch dynamically imported module: …/Page-a1.js (Chrome)',
        'TypeError: error loading dynamically imported module: …/Page-a1.js (Firefox)',
        'TypeError: Importing a module script failed. (Safari)',
        "Hydration failed because the server rendered HTML didn't match the client. (React)",
      ],
      answer: [0, 1, 2, 3],
      why: 'webpack wraps chunk failures in its own `ChunkLoadError`; with native `import()` (Vite builds) each browser reports a failed module fetch as a `TypeError` with its own wording. Error monitoring and reload handlers need to recognise all of them. **Not the hydration error:** that means the first client render produced different markup than the server HTML, which is unrelated to loading chunks.',
    },
    {
      kind: 'quiz',
      id: 'dl-q12',
      title: 'Preloading before hydration',
      prompt: "This app awaits the current route's lazy chunks before calling `hydrateRoot` on a prerendered page. What does that buy?",
      options: [
        "Hydration can finish in one pass: the lazy page doesn't suspend, so it becomes interactive as soon as the code runs",
        'Lazy components cannot be rendered to HTML at all without it',
        'It makes the HTML smaller',
        'It prevents the server HTML from being shown before JavaScript loads',
      ],
      answer: 0,
      why: 'If the page\'s chunk isn\'t loaded yet, the lazy component suspends during hydration: that part can\'t be hydrated (and isn\'t interactive) until the chunk arrives and React retries. Awaiting the chunks first, while `modulepreload` links have already started downloading them in parallel, lets hydration complete in one go. **Not "cannot be rendered to HTML":** the prerender renders them by loading every page first. **Not "smaller HTML":** it happens in the browser, after the HTML arrived. **Not "prevents the HTML from showing":** the HTML is visible immediately; that\'s the point of prerendering.',
    },
    {
      kind: 'quiz',
      id: 'dl-q13',
      title: 'A new version during checkout',
      prompt: 'Your shop detects that a new version is live while a user is on the payment step of checkout. What should the app do?',
      options: [
        'Nothing yet: let them finish, and switch to the new version with a full page load on a later navigation, e.g. after the order confirmation',
        'Reload immediately so they pay with the latest code',
        'Log them out so they start a fresh session',
        'Block the payment until they refresh',
      ],
      answer: 0,
      why: 'The checkout\'s code is already loaded and keeps working, so interrupting gains nothing and risks losing the order. Switch at a safe moment instead: the next navigation outside the flow, or after confirmation. Keeping the cart on the server and the API backwards-compatible covers the rest. **Not "reload immediately":** it can lose form state mid-payment. **Not "log out":** that hurts the user and doesn\'t change the code. **Not "block the payment":** that\'s only justified for a critical fix, enforced by the server.',
    },
    {
      kind: 'order',
      id: 'dl-o4',
      title: 'Recovering from a missing chunk',
      prompt: 'An old tab hits a chunk that a deploy removed, and the app has a guarded `vite:preloadError` handler. Order the steps.',
      items: [
        "The user clicks a link to a route they haven't opened yet",
        'The old entry code imports the chunk by its old hashed name and gets a 404',
        'The import rejects and Vite dispatches `vite:preloadError` on `window`',
        'The handler finds no recent reload timestamp in sessionStorage, stores one and calls `event.preventDefault()`',
        'The page reloads and the browser revalidates the HTML, getting the new version',
        'The new entry code imports the chunk under its new name and the route renders',
      ],
      why: 'A reload is the real fix because only the new HTML knows the new file names. `preventDefault()` stops the error from being thrown while the reload happens, and the stored timestamp stops a second reload if the new build fails the same way.',
    },
    {
      kind: 'order',
      id: 'dl-o5',
      title: 'Renaming an API field safely',
      prompt: 'Order the steps to rename the API field `price` to `amount` while old tabs are still open.',
      items: [
        'Backend returns and accepts both `price` and `amount`',
        'Deploy the frontend that reads and sends only `amount`',
        'Wait until no client still uses `price` (check logs of the app-version header)',
        'Remove `price` from the backend',
      ],
      why: 'Expand → migrate → contract. Old and new clients overlap after every deploy, so the backend must support both until the old ones are gone. Removing the field first would break every tab that loaded the old code.',
    },
    {
      kind: 'code',
      id: 'cache-control',
      title: 'Cache-Control per path',
      difficulty: 'easy',
      prompt:
        'Return the `Cache-Control` header for a request path: content-hashed build assets (`/assets/<name>-<8-char hash>.<ext>`) are cached for a year and immutable, API responses are never stored, and everything else (HTML, unhashed files) is stored but revalidated on every use.',
      ...code('cache-control'),
    },
    {
      kind: 'code',
      id: 'import-retry',
      title: 'Retry a lazy import',
      difficulty: 'medium',
      prompt:
        'Wrap a dynamic `import()` so that a failed load is retried with exponential backoff, and the last error is rethrown when every attempt fails. Then explain why this helps with flaky networks but not with a chunk deleted by a deploy.',
      ...code('import-retry'),
    },
    {
      kind: 'code',
      id: 'chunk-reload',
      title: 'Reload once on a chunk error',
      difficulty: 'medium',
      prompt:
        'Build the handler for `vite:preloadError`: reload the page to pick up the new deploy, but at most once per time window, remembered in storage that survives the reload, so a broken build can never cause a reload loop.',
      ...code('chunk-reload'),
    },
    {
      kind: 'code',
      id: 'version-watcher',
      title: 'Detect a new deploy',
      difficulty: 'medium',
      prompt:
        'Track whether a newer version is live, ignoring failed checks, and decide whether the next navigation should be a full page load, except while the user is inside a protected flow such as checkout.',
      ...code('version-watcher'),
    },
  ],
};
