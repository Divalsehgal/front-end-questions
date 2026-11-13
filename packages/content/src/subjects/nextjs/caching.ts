import type { Topic } from '../../types';

export const caching: Topic = {
  slug: 'caching',
  title: 'Caching & revalidation',
  questions: [
    {
      kind: 'order',
      id: 'nx-c1',
      title: 'The cache layers',
      prompt: 'Order the cache layers a request passes through, from closest to the user to the source of truth.',
      items: [
        'Browser cache (Cache-Control max-age)',
        'CDN / Edge cache (s-maxage)',
        'Next.js Full Route Cache (prerendered HTML + RSC payload, `revalidate`)',
        'Next.js Data Cache (opt-in since Next 15: `force-cache`, `next.revalidate`, tags)',
        'Database / upstream API',
      ],
      why: 'Each layer can serve the request and stop it from reaching the next. Invalidation has to target the right layer: revalidateTag purges the data cache, and HTTP headers control browser/CDN behaviour.',
    },
    {
      kind: 'quiz',
      id: 'nx-c2',
      title: 'Pick the strategy',
      prompt: "An admin changes a product's price and it must show immediately. Which do you use?",
      options: [
        "Cache the fetch with a tag (`cache: 'force-cache', next: { tags: ['product-123'] }`) and call `revalidateTag('product-123')` after the update",
        'Lower `revalidate` to 1 second',
        '`export const revalidate = 3600`',
        'Add `Cache-Control: max-age=0` to the page',
      ],
      answer: 0,
      why: "Tag the cached fetch and call `revalidateTag('product-123')` after the update: event-driven invalidation is instant and only purges entries with that tag. **Not revalidate: 1:** still up to a second stale, and regenerates constantly for every visitor. **Not revalidate = 3600:** up to an hour stale. **Not max-age=0 on the page:** controls the browser cache, not the Next.js Data/Full Route cache that holds the old price. Use granular tags; in Next 16 `updateTag()` in a Server Action gives read-your-own-writes.",
    },
    {
      kind: 'quiz',
      id: 'nx-c3',
      title: 'Reading Cache-Control',
      prompt: 'What does `Cache-Control: public, s-maxage=60, stale-while-revalidate=300` do?',
      options: [
        'CDNs cache it for 60s; for 300s after that they may serve the stale copy while refetching in the background',
        'Browsers cache it for 60s and CDNs for 300s',
        'Nothing is cached; it only sets a timeout',
        'The browser must revalidate every 60s',
      ],
      answer: 0,
      why: "`s-maxage=60` applies to shared caches (CDNs) for 60s, and `stale-while-revalidate=300` lets them serve the stale copy for up to 300s more while refetching in the background, so users never wait on a refetch. **Not browser 60s / CDN 300s:** browsers use `max-age`, which isn't set, and 300 is the stale window, not a freshness lifetime. **Not 'nothing cached':** `public` + `s-maxage` explicitly allow caching. **Not 'browser revalidates every 60s':** s-maxage doesn't apply to the browser.",
    },
    {
      kind: 'quiz',
      id: 'nx-c4',
      title: 'Real-time data',
      prompt: 'Stock level on a product page must always be live. Which fetch option?',
      options: ["`cache: 'no-store'`", '`next: { revalidate: 300 }`', "`next: { tags: ['stock'] }`", 'No option: fetch is never cached'],
      answer: 0,
      why: "`cache: 'no-store'` opts the request out of the Data Cache and makes the route render per request, so every view sees current stock. **Not revalidate: 300:** up to five minutes stale. **Not tags:** tags enable on-demand invalidation of a cached value; it is still cached until something invalidates it. **Not 'never cached':** Next 15 doesn't cache fetch by default, but on an otherwise static route the result is baked in at build time, so be explicit. For per-second updates, poll on the client (SWR/TanStack Query).",
    },
    {
      kind: 'quiz',
      id: 'nx-c5',
      title: 'Request memoization and the Router Cache',
      prompt: 'Which statements about Next.js caching are true?',
      options: [
        'Identical `fetch` calls (same URL and options) during one server render are deduplicated: request memoization',
        'The client Router Cache keeps visited and prefetched route segments in memory for back/forward and instant navigation',
        '`router.refresh()` re-fetches the current route from the server without losing client state',
        "Request memoization shares results across different users' requests",
      ],
      answer: [0, 1, 2],
      why: "Identical `fetch` calls in one server render are deduplicated (request memoization), the client Router Cache keeps visited and prefetched segments for instant back/forward, and `router.refresh()` refetches the current route's server payload while keeping client state. **Not shared across users:** memoization lives for one render pass of one request only; cross-request caching is the Data Cache. For non-fetch data sources wrap the function in React's `cache()`.",
    },
    {
      kind: 'flashcard',
      id: 'nx-cf1',
      title: 'Caching decision framework',
      front: 'Map each need to a caching tool: CDN caching, whole-page caching, fine-grained data control, instant updates, real-time.',
      back: `- Global/CDN caching for an API → **Cache-Control** headers (s-maxage, stale-while-revalidate)
- Whole page rarely changes → **export const revalidate = 3600** (ISR)
- Parts of the page with different freshness → **fetch(..., { next: { revalidate } })**
- Must update right after an admin change → **tags + revalidateTag**
- Must always be live → **cache: 'no-store'** (or client polling)

Next 15+: fetch is uncached by default, so caching is opt-in (\`force-cache\`, \`revalidate\`, or \`'use cache'\` + \`cacheLife\`).

Common mistakes: relying only on revalidate (stale), only on headers (Next's own caches still serve stale data), mismatched TTLs (inconsistent UI).`,
    },
  ],
};
