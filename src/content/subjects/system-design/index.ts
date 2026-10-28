import { codeFiles } from '../../files';
import type { Subject } from '../../types';

const code = codeFiles('system-design', import.meta.glob<string>('./files/*', { query: '?raw', import: 'default', eager: true }));

export const systemDesign: Subject = {
  slug: 'system-design',
  title: 'Frontend system design',
  blurb: 'The RADIO framework, rendering strategies, data and state modelling, APIs and real-time, performance, and walkthroughs of classic prompts.',
  icon: 'network',
  topics: [
    {
      slug: 'radio',
      title: 'The RADIO framework',
      questions: [
        {
          kind: 'order',
          id: 'sd-o1',
          title: 'RADIO, in order',
          prompt: 'Order the steps of the RADIO framework for a frontend system design interview.',
          items: [
            'Requirements (functional + non-functional)',
            'Architecture (components and how they talk)',
            'Data model (entities, client state, server cache)',
            'Interface / API (contracts between client and server, and between components)',
            'Optimizations (performance, network, a11y, i18n, security)',
          ],
          why: 'Spend the first minutes on Requirements: everything else depends on them. Then sketch the architecture, define data and APIs, and only then deep-dive into optimisations, steered by the non-functional requirements you agreed on.',
        },
        {
          kind: 'flashcard',
          id: 'sd-f1',
          title: 'R: requirements',
          front: 'What do you clarify in the Requirements step?',
          back: `**Functional**: the core features without which the product is incomplete (e.g. "type → see suggestions → pick one").
**Non-functional**: performance (latency targets, devices, slow networks), scalability (data size, number of users), availability and offline behaviour, accessibility, i18n, security, and maintainability.

Also ask about scope (which platforms? an SDK or a product?), and agree on what's out of scope. Write it down, because you'll refer back to it.`,
        },
        {
          kind: 'flashcard',
          id: 'sd-f2',
          title: 'A, D, I: architecture, data, interface',
          front: 'What goes into Architecture, Data model and Interface?',
          back: `**Architecture**: a component diagram (view, controller/state, client store, network layer, server), plus rendering strategy (CSR/SSR/SSG) and where state lives.
**Data model**: entities and relations; split **server state** (cached API data) from **client state** (UI, form drafts); normalise by id.
**Interface**: API endpoints or GraphQL queries with request/response shapes, pagination style, errors and status codes, and component props/events for reusable widgets.`,
        },
        {
          kind: 'flashcard',
          id: 'sd-f3',
          title: 'O: optimizations checklist',
          front: 'List the optimisation areas to cover at the end of a frontend design round.',
          back: `- **Performance**: code splitting, lazy loading, virtualised lists, memoisation, Core Web Vitals (LCP, INP, CLS)
- **Network**: caching (HTTP + client), debouncing, request dedup/cancellation, pagination, compression, CDN, prefetching
- **UX**: optimistic updates, skeletons, error and empty states, offline support
- **Accessibility**: keyboard, focus management, ARIA, contrast, reduced motion
- **i18n**: RTL, plurals, dates and numbers, string length
- **Multi-device**: responsive layout, touch targets, slow CPUs
- **Security**: XSS (escape, CSP), CSRF, auth token storage`,
        },
      ],
    },
    {
      slug: 'rendering-data',
      title: 'Rendering, data & networking',
      questions: [
        {
          kind: 'quiz',
          id: 'sd-q1',
          title: 'Pick the rendering strategy',
          prompt: 'A marketing site with pages that change weekly and must rank well in search. Best default?',
          options: ['SSG/ISR (static HTML, regenerated on a schedule or on demand)', 'Pure CSR', 'SSR on every request', 'Client-side polling'],
          answer: 0,
          why: 'Content that changes weekly and needs SEO is ideal for static HTML served from a CDN: fastest TTFB, fully crawlable, and ISR regenerates pages on a schedule or on demand without a full rebuild. **Not pure CSR:** crawlers and users get an empty shell until JS runs, bad for SEO and LCP. **Not SSR per request:** works, but pays server time on every hit for content that changes weekly. **Not client polling:** solves freshness for live data, not first render or SEO.',
        },
        {
          kind: 'quiz',
          id: 'sd-q2',
          title: 'Offset vs cursor pagination',
          prompt: 'An infinite news feed gets new posts inserted at the top constantly. Which pagination?',
          options: [
            'Cursor-based (`?after=<lastId>`): stable even when new items arrive',
            'Offset-based (`?page=3&limit=20`)',
            'Load everything once',
            'Random sampling',
          ],
          answer: 0,
          why: "A cursor (`?after=<lastId>`) points at a stable position in the list, so new posts inserted at the top don't shift what the next page returns. **Not offset:** every insert shifts all pages, so users see duplicates or miss items, and deep offsets are slow in databases. **Not load everything:** an unbounded feed can't be fetched at once. **Not random sampling:** a feed must be ordered and complete. Offsets are fine for page-numbered tables whose data rarely changes.",
        },
        {
          kind: 'quiz',
          id: 'sd-q3',
          title: 'Real-time updates',
          prompt: 'Match: live chat (both directions) · live sports score (server → client only) · order status that changes every few minutes.',
          options: ['WebSocket · Server-Sent Events · polling', 'Polling · WebSocket · SSE', 'SSE · polling · WebSocket', 'WebSocket for all three'],
          answer: 0,
          why: "Chat needs both directions with low latency (WebSocket); scores only flow server to client (SSE: a one-way HTTP stream with auto-reconnect); a status that changes every few minutes doesn't justify a persistent connection (polling). **Not Polling · WebSocket · SSE:** polling is too laggy and wasteful for chat. **Not SSE · polling · WebSocket:** SSE can't send client messages, and a socket for rare updates is overkill. **Not WebSocket for all three:** works, but adds connection management where simpler tools suffice. Pick the least complex tool that meets the latency need.",
        },
        {
          kind: 'quiz',
          id: 'sd-q4',
          title: 'Server state vs client state',
          prompt: 'Which belongs in a server-state cache (React Query / SWR / RTK Query) rather than in a client store?',
          options: ['The list of products fetched from the API', 'Whether the filters panel is open', 'A half-typed form draft', 'The current theme'],
          answer: 0,
          why: 'The product list is a cache of data the server owns, so it needs deduping, staleness, background refetch, retries and invalidation, which is exactly what React Query / SWR / RTK Query provide. **Not filters panel open, form draft, or theme:** all three are owned by the client, never fetched, and belong in local state or a small client store.',
        },
        {
          kind: 'flashcard',
          id: 'sd-f4',
          title: 'Optimistic updates',
          front: 'How do you implement an optimistic "like" button safely?',
          back: `1. Update the UI immediately (increment the count, mark as liked) and remember the previous state.
2. Send the request in the background.
3. On success, optionally reconcile with the server's response.
4. On failure, **roll back** to the previous state and show an error.
5. Guard against races: disable repeat clicks or send the final intended state, and dedupe requests.

React 19's \`useOptimistic\` and React Query's \`onMutate\`/\`onError\` encode this pattern.`,
        },
        {
          kind: 'code',
          id: 'normalize',
          title: 'Normalize nested API data',
          difficulty: 'medium',
          prompt:
            'Flatten posts → authors → comments into `posts`, `users` and `comments` tables keyed by id, with relations replaced by ids and the original order kept in `postIds`. Then explain why normalized state makes updates cheaper.',
          ...code('normalize'),
        },
      ],
    },
    {
      slug: 'case-studies',
      title: 'Classic prompts',
      questions: [
        {
          kind: 'flashcard',
          id: 'sd-c1',
          title: 'Design an autocomplete',
          front: 'Design a search autocomplete/typeahead component. Hit the key points.',
          back: `- **Requirements**: suggestions after N chars, keyboard navigation, highlight matches, works on slow networks, a11y, configurable result rendering.
- **Architecture**: Input → debounced query → cache lookup → fetch (with \`AbortController\` for stale requests) → results list (virtualised if long).
- **Data**: \`Map<query, results>\` cache with an LRU/TTL; for small static datasets, filter client-side or use a trie.
- **Interface**: \`fetchSuggestions(query)\` plus props like \`minChars\`, \`debounceMs\`, \`renderItem\`, \`onSelect\`.
- **Optimise**: debounce 200–300ms; ignore out-of-order responses; ARIA combobox pattern (\`role="combobox"\`, \`aria-activedescendant\`, listbox/option); cache prefixes; loading, empty and error states.`,
        },
        {
          kind: 'flashcard',
          id: 'sd-c2',
          title: 'Design a news feed',
          front: 'Design an infinite-scrolling news feed (Facebook/Twitter style).',
          back: `- **Requirements**: infinite scroll, mixed post types (text, image, video), likes and comments, new-post indicator, fast first paint, works on low-end phones.
- **Rendering**: SSR or streamed first page for fast LCP, then client-side pagination.
- **Data**: normalized posts/users; **cursor** pagination; server-state cache.
- **Loading**: \`IntersectionObserver\` sentinel to fetch the next page; **virtualise** the list (only render what's on screen); lazy-load images with reserved dimensions (no CLS).
- **Real-time**: SSE/WebSocket or polling for a "N new posts" banner, so content never jumps under the user's finger.
- **Interactions**: optimistic likes; comments loaded on demand.
- **Other**: preserve scroll position on back-navigation; a11y (\`role="feed"\`, \`aria-busy\`).`,
        },
        {
          kind: 'flashcard',
          id: 'sd-c3',
          title: 'Design an image carousel / gallery',
          front: 'What would you cover when designing a reusable image carousel component?',
          back: `- **API**: \`items\`, \`renderItem\`, \`autoPlay\`, \`interval\`, \`loop\`, \`onChange\`, controlled vs uncontrolled \`index\`.
- **Performance**: lazy-load off-screen images and preload neighbours; \`srcset\`/\`sizes\`; animate with \`transform\` (GPU); avoid layout shift with an aspect-ratio box.
- **Input**: buttons, dots, swipe (pointer events), keyboard arrows.
- **A11y**: \`aria-roledescription="carousel"\`, a label for each slide ("3 of 8"), pause autoplay on hover/focus and provide a pause button (WCAG 2.2.2), respect reduced motion.
- **Edge cases**: a single item, items changing while open, RTL.`,
        },
      ],
    },
  ],
};
