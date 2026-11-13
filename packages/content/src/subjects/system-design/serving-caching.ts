import type { Topic } from '../../types';

export const servingCaching: Topic = {
  slug: 'serving-caching',
  title: 'Serving, hashing & caching',
  questions: [
    {
      kind: 'flashcard',
      id: 'dl-f1',
      title: 'Where the HTML comes from',
      front: 'For a request to `/products/42`, where is the HTML produced in a pure SPA, with SSR, and with SSG (prerendering)?',
      back: `- **Pure SPA**: nowhere. Every URL gets the same near-empty \`index.html\` (\`<div id="root"></div>\` plus a script); JavaScript builds the page in the browser.
- **SSR**: a server runs the app **on each request** and returns full HTML. Needs a running server; can use per-request data (cookies, the database).
- **SSG / prerender**: the app is run **once at build time** for every known URL and the HTML is saved as files (\`dist/products/42/index.html\`). Any static host or CDN serves them; no code runs per request, so the HTML is the same for everyone until the next build.

SSR and SSG look the same to the browser: full HTML first, then JavaScript that hydrates it.`,
    },
    {
      kind: 'flashcard',
      id: 'dl-f2',
      title: 'Hydration',
      front: 'What is hydration, and why must the first client render match the server HTML?',
      back: `The server (or the build) sent finished HTML, so the page is **visible but not interactive**: no event handlers are attached yet. Hydration is React rendering the same tree in the browser and **adopting the existing DOM** (\`hydrateRoot\`) instead of creating it, attaching handlers as it goes.

React assumes the DOM it adopts is what it would have rendered. If the first client render differs (a date, \`Math.random()\`, data read from \`localStorage\`, \`typeof window\` checks), React reports a hydration mismatch and may re-render that part on the client, which costs time and can flash. The usual fix is to render the server's version first and switch to client-only data in an effect or with \`useSyncExternalStore\`'s server snapshot.`,
    },
    {
      kind: 'flashcard',
      id: 'dl-f3',
      title: 'Why filenames carry a content hash',
      front: 'Why does a build emit `index-BFP5p68h.js` instead of `index.js`, and why is `index.html` never hashed?',
      back: `The hash is computed from the file's **contents**. Same bytes → same name; one changed byte → a new name.

That makes "cache forever" safe: a URL like \`/assets/index-BFP5p68h.js\` can never point to different code, so browsers and CDNs may keep it for a year without checking. A deploy doesn't need to invalidate it: the new code simply has a **new URL** that no cache has seen.

\`index.html\` is the entry point people type and link to, so its URL must stay the same across deploys. It is the one file that changes in place, so it must be **revalidated** (\`no-cache\`), and it always points to the current hashed files.`,
    },
    {
      kind: 'flashcard',
      id: 'dl-f4',
      title: 'Who controls caching',
      front: 'Caching of JS chunks involves the bundler, the server/CDN and the browser. What does each one control?',
      back: `- **Bundler** (Vite/Rollup, webpack): the **file names** (content hash: Vite does it by default, webpack via \`[contenthash]\`) and **how code is split** into chunks. It doesn't cache anything itself.
- **Server / CDN**: the **\`Cache-Control\` header** sent with each response (e.g. \`vercel.json\` headers, nginx \`add_header\`, S3 object metadata) and how long its own edge copies live.
- **Browser**: actually **stores** responses (memory or disk cache) and obeys the headers. You can't choose where it stores them, and it may evict them early under storage pressure.

So: the bundler makes URLs safe to cache, the header turns caching on.`,
    },
    {
      kind: 'flashcard',
      id: 'dl-f5',
      title: 'Cache-Control vocabulary',
      front: 'What do `max-age`, `immutable`, `no-cache`, `no-store`, `must-revalidate`, `public`, `private` and `s-maxage` mean?',
      back: `- \`max-age=N\`: fresh for N seconds; until then it may be used without asking the server.
- \`immutable\`: won't change while fresh, so supporting browsers skip revalidation even on a user reload.
- \`no-cache\`: **may be stored**, but must be revalidated with the server before **every** use. (It does not mean "don't cache".)
- \`no-store\`: don't keep a copy anywhere.
- \`must-revalidate\`: once stale, it must not be used without a successful revalidation. \`max-age=0, must-revalidate\` behaves much like \`no-cache\`.
- \`public\`: shared caches (CDNs, proxies) may store it. \`private\`: only the user's browser may.
- \`s-maxage=N\`: freshness for shared caches only; overrides \`max-age\` there.

Typical setup: hashed assets \`public, max-age=31536000, immutable\`; HTML \`no-cache\`; personal API data \`no-store\` or \`private\`.`,
    },
    {
      kind: 'flashcard',
      id: 'dl-f6',
      title: 'Revalidation and 304',
      front: 'How does a browser revalidate a cached HTML page, and what does a 304 response mean?',
      back: `The first response carried a validator: an \`ETag\` (a version tag) and/or \`Last-Modified\`. To revalidate, the browser sends a **conditional request** with the validator it has:
- \`If-None-Match: "<etag>"\`, or
- \`If-Modified-Since: <date>\`.

If the resource hasn't changed, the server answers **\`304 Not Modified\` with no body** and the browser uses its stored copy. If it has changed, it answers \`200\` with the new body and new validators.

So \`no-cache\` HTML still costs a round trip on every visit, but usually only a few hundred bytes.`,
    },
    {
      kind: 'flashcard',
      id: 'dl-f7',
      title: 'CDN edge caching',
      front: 'What are origin and edge in a CDN, what is a cache miss vs a hit, and what happens to edge copies on a deploy?',
      back: `- **Origin**: where your files really live (the build output in storage, or your server).
- **Edge**: CDN servers in many locations, close to users.

An edge only holds a file after someone near it requested it. The first request is a **miss**: the edge fetches from the origin, keeps a copy (if the headers allow it) and responds. Later requests nearby are **hits**, served from the edge.

On a deploy, stale edge copies of unhashed URLs (like the HTML) must be dropped: some platforms do this automatically per deployment (e.g. Vercel, Netlify); on others you create an **invalidation/purge** yourself (e.g. CloudFront). Hashed assets don't need purging: new code has new URLs.`,
    },
    {
      kind: 'quiz',
      id: 'dl-q1',
      title: 'Header for a hashed chunk',
      prompt: 'Which `Cache-Control` header suits `/assets/index-BFP5p68h.js`, a content-hashed file from a Vite build?',
      options: ['public, max-age=31536000, immutable', 'no-cache', 'no-store', 'public, max-age=300'],
      answer: 0,
      why: 'The URL is tied to the file contents, so it can never serve different code: caching it for a year (31536000 s) without revalidating is safe, and a deploy publishes new code under new names. **Not `no-cache`:** that forces a round trip per file on every visit for nothing. **Not `no-store`:** every visit would re-download every chunk. **Not `max-age=300`:** it expires after 5 minutes and gets revalidated for no reason, since the file can never change.',
    },
    {
      kind: 'quiz',
      id: 'dl-q2',
      title: 'What `no-cache` really means',
      prompt: '`index.html` is served with `Cache-Control: no-cache`. What does the browser do?',
      options: [
        'Stores it, but checks with the server (a conditional request) before every use',
        'Never stores it at all',
        'Stores it and uses it without asking until the browser is closed',
        'Stores it for the default 24 hours',
      ],
      answer: 0,
      why: '`no-cache` means "you may keep it, but revalidate before using it". With an `ETag` that check is usually a small `304 Not Modified`. **Not "never stores it":** that is `no-store`. **Not "until the browser closes":** that describes neither directive; `no-cache` requires a check every time. **Not "24 hours":** there is no such default; freshness comes from `max-age` (or a heuristic when no freshness information is sent at all).',
    },
    {
      kind: 'quiz',
      id: 'dl-q3',
      title: 'A repeat visit with nothing deployed',
      prompt:
        "Yesterday you visited a site whose HTML is `no-cache` (with an `ETag`) and whose hashed assets are `max-age=31536000, immutable`. Nothing has been deployed since. What network traffic does today's visit cause?",
      options: [
        'One conditional request for the HTML, answered with 304; the JS and CSS come from the browser cache without any request',
        'Nothing at all: everything comes from the cache',
        'The HTML is re-downloaded in full, and so is every asset',
        'A 304 for the HTML and a 304 for each asset',
      ],
      answer: 0,
      why: 'The HTML must be revalidated (`no-cache`), and since it didn\'t change the server replies `304` with no body. The assets are still fresh for a year, so they are used straight from the memory or disk cache. **Not "nothing at all":** `no-cache` always costs that check. **Not "everything re-downloaded":** the ETag makes the HTML check cheap, and fresh assets need no request. **Not "304 for each asset":** fresh, immutable assets are not revalidated at all.',
    },
    {
      kind: 'quiz',
      id: 'dl-q4',
      title: 'Long-caching the HTML',
      prompt: 'A team sets `Cache-Control: public, max-age=31536000` on `index.html` too, to make repeat visits faster. What goes wrong?',
      options: [
        "Returning visitors keep the old HTML, which points at the old chunks, so they don't see new deploys for up to a year",
        'Nothing, because the JS filenames are hashed',
        'The browser refuses to cache HTML for that long',
        'Only the CDN is affected; browsers always revalidate HTML',
      ],
      answer: 0,
      why: 'The HTML is what tells the browser which hashed files to load. If the browser may reuse it for a year without asking, it keeps loading the old chunks, and you can\'t purge a user\'s browser cache from the server. **Not "nothing":** hashing only helps if the HTML that names the files is fresh. **Not "refuses":** browsers honour long `max-age` on HTML. **Not "browsers always revalidate HTML":** they follow the headers; a normal navigation reuses fresh cached HTML.',
    },
    {
      kind: 'quiz',
      id: 'dl-q5',
      title: 'No Cache-Control at all',
      prompt:
        'A host serves `index.html` with a `Last-Modified` date but no `Cache-Control` or `Expires`. After a deploy, some users still get the old page for a while. Why?',
      options: [
        'Browsers may apply heuristic freshness: reuse it without asking for a fraction of the time since it was last modified',
        'Without Cache-Control the browser never caches, so the CDN must be at fault',
        'Last-Modified forces the browser to cache for 24 hours',
        'The hashed JS files are stale',
      ],
      answer: 0,
      why: 'When a cacheable response has no explicit freshness, HTTP lets caches estimate one; the common heuristic is 10% of the time since `Last-Modified`. A page last changed 10 days ago may be reused for about a day without asking. Set an explicit `Cache-Control: no-cache` on HTML to avoid it. **Not "never caches":** missing headers don\'t mean uncacheable. **Not "24 hours":** there is no fixed 24-hour rule. **Not stale JS:** the old HTML points at the old hashed files, which is the symptom, not the cause.',
    },
    {
      kind: 'quiz',
      id: 'dl-q6',
      title: 'Which hashes change',
      prompt:
        "You edit only `Checkout.tsx`, which is its own lazy chunk loaded with `import('./pages/Checkout')` from the entry chunk. After the rebuild, which file names change?",
      options: [
        'The Checkout chunk, and the entry chunk that references it by file name; unrelated chunks keep their names',
        'Only the Checkout chunk',
        'Every chunk, because the build ran again',
        'None until you bump the package version',
      ],
      answer: 0,
      why: 'The Checkout chunk\'s contents changed, so its hash changes. The entry\'s compiled code contains the string `import(\'./Checkout-<hash>.js\')`, so its contents (and hash) change too. Chunks that don\'t reference it keep their names, so returning users re-download only those files. **Not "only Checkout":** the importer embeds the new name. **Not "every chunk":** hashes come from contents, not from build time. **Not "package version":** the version isn\'t part of the hash.',
    },
    {
      kind: 'order',
      id: 'dl-o1',
      title: 'First visit to a prerendered page',
      prompt: 'Order what happens on a first visit to a prerendered (SSG) React page, from request to interactive.',
      items: [
        'The browser requests the URL; the CDN edge returns the HTML file (fetching it from the origin on a miss)',
        'The browser parses the HTML: the content is visible but nothing is clickable yet',
        'CSS, the entry script and the `modulepreload`-linked chunks download in parallel',
        "The entry script runs and makes sure the current route's lazy chunks are loaded",
        'React hydrates: renders the same tree, adopts the existing DOM and attaches event handlers',
        'The page is interactive; client-only data (e.g. from localStorage) renders on the next pass',
      ],
      why: "Prerendering gives a fast first paint because the HTML already contains the content. Interactivity waits for JavaScript, and hydration must produce the same markup, so browser-only data is applied after it. `modulepreload` links let the route's chunks download alongside the entry instead of after it.",
    },
    {
      kind: 'order',
      id: 'dl-o2',
      title: "This app's build pipeline",
      prompt: 'Order the steps of `npm run build` in this app.',
      items: [
        'Type-check the project (`tsc -b`)',
        'Client build (`vite build`): bundle, minify, split chunks, content-hash file names, write a manifest',
        'Server build of `src/entry-server.tsx` for Node (`vite build --ssr`)',
        'Prerender: render each route to HTML, add its `modulepreload` links, write `dist/<route>/index.html`',
        'Generate the sitemap and robots.txt',
      ],
      why: "The prerender needs both earlier builds: the Node build to run React (`renderToString`), and the client manifest to know each route's hashed chunk names for its `modulepreload` links. The sitemap is generated last from the final list of pages.",
    },
    {
      kind: 'order',
      id: 'dl-o3',
      title: 'A returning visitor after a deploy',
      prompt: 'A user who visited last week opens the site again after a deploy. HTML is `no-cache`; hashed assets are cached for a year. Order what happens.',
      items: [
        'The browser sends a conditional request for the HTML (`If-None-Match` with its stored ETag)',
        'The ETag no longer matches, so the server responds 200 with the new HTML',
        'The browser reads the new hashed file names from the HTML',
        'Unchanged files are found in the cache under their old names; changed ones are downloaded',
        'React hydrates with the new code',
      ],
      why: 'The always-revalidated HTML is how a deploy reaches users. Because names come from content, only files whose contents changed have new URLs, so a returning user downloads just the difference.',
    },
  ],
};
