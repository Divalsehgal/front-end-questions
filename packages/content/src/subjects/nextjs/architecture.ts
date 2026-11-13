import type { Topic } from '../../types';

export const architecture: Topic = {
  slug: 'architecture',
  title: 'Architecture & the PDP case study',
  questions: [
    {
      kind: 'quiz',
      id: 'nx-a1',
      title: 'Per-component rendering on a PDP',
      prompt: 'On a product detail page, which pairing is right?',
      options: [
        'Description: ISR · Price/stock: no-store · Reviews: streamed in Suspense · Recommendations: client-side',
        'Everything: no-store, to be safe',
        'Everything: ISR with a 10 minute revalidate',
        'Description: client-side · Price: ISR · Reviews: no-store',
      ],
      answer: 0,
      why: "Choose per component by volatility: the description rarely changes (ISR), price and stock must be live (no-store), reviews are slow and non-critical (stream in Suspense so they don't block first paint), recommendations are personalised (client-side, so the shell stays cacheable). **Not everything no-store:** every request pays full render cost for mostly static content. **Not everything ISR 10min:** price and stock go stale. **Not description client-side, price ISR, reviews no-store:** each choice is inverted relative to its data's needs.",
    },
    {
      kind: 'flashcard',
      id: 'nx-af1',
      title: 'Container / presentational on the server',
      front: 'How does the container–presentational pattern map onto Server Components?',
      back: `**Containers** are async Server Components that fetch, transform and decide (e.g. \`ReviewsContainer\` awaits a service).
**Presentational** components just render props: easy to test, and reusable.

Put data access in plain async **service functions** (\`getProduct(slug)\`), not "server hooks". Wrap slow containers in **Suspense** so they stream in parallel. Services are for reads, Server Actions for mutations, Route Handlers for external APIs.`,
    },
    {
      kind: 'flashcard',
      id: 'nx-af2',
      title: 'Edge vs Node runtime',
      front: 'When would you choose the Edge runtime over Node.js for a route?',
      back: `**Edge**: lightweight, low-latency compute near the user, for redirects, rewrites, auth and geo checks. Limited APIs: no Node built-ins and many DB drivers don't work. (Cacheable pages are served from the CDN whatever the runtime. Next 16 replaces middleware with \`proxy.ts\` on Node, and Node is the default for most routes.)

**Node.js**: full ecosystem. Use it for business logic, direct database access, auth-protected APIs, mutations and background work.

And remember Node's event loop: CPU-heavy work in a Server Component blocks every user on that instance.`,
    },
  ],
};
