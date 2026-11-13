import type { Topic } from '../../types';

export const renderingTopic: Topic = {
  slug: 'rendering',
  title: 'Server Components & hydration',
  questions: [
    {
      kind: 'quiz',
      id: 'nx-r1',
      title: 'Causes of hydration mismatch',
      prompt: 'Which of these cause a hydration mismatch?',
      options: [
        'Rendering `Date.now()` or `Math.random()` directly',
        'Reading `window` / `localStorage` during the first render',
        'Invalid nesting like a `<p>` inside a `<p>` or a `<div>` inside a `<p>`',
        'Fetching data in a Server Component',
      ],
      answer: [0, 1, 2],
      why: "Hydration expects the client's first render to produce exactly the server HTML: `Date.now()`/`Math.random()` differ between the two runs, `window`/`localStorage` don't exist on the server so the branches diverge, and invalid nesting (`<p>` in `<p>`) is silently 'fixed' by the browser's parser so the DOM no longer matches React's tree. **Not fetching in a Server Component:** that is the normal data path; the result is serialized into the payload, so both sides see the same data.",
    },
    {
      kind: 'quiz',
      id: 'nx-r2',
      title: 'Fixing a client-only value',
      prompt: "You need to show the user's local time without a hydration error. Best fix?",
      code: `export default function ViewedAt() {
  return <span>Viewed at: {new Date().toLocaleTimeString()}</span>;
}`,
      options: [
        'Render a placeholder first, then set the time in `useEffect` (two-pass rendering)',
        'Add `"use server"` to the file',
        'Wrap it in `Suspense`',
        'Call `toLocaleTimeString()` inside `useMemo`',
      ],
      answer: 0,
      why: "Effects run only on the client after hydration, so render a placeholder that matches the server HTML, then set the real time in `useEffect` (two-pass rendering). **Not 'use server':** that marks Server Actions, it doesn't make rendering client-only. **Not Suspense:** nothing suspends; the mismatched value still renders on both sides. **Not useMemo:** it still runs during render on both server and client, giving different strings. Alternatives: `dynamic(..., { ssr: false })`, or `suppressHydrationWarning` for an intentional, harmless mismatch.",
    },
    {
      kind: 'quiz',
      id: 'nx-r3',
      title: 'Where to put "use client"',
      prompt: 'A product card is static except for a like button. Where should `"use client"` go?',
      options: [
        'On the `LikeButton` only, rendered inside a Server Component card',
        'On the `ProductCard`',
        'On the page',
        'In `layout.tsx` so every page is interactive',
      ],
      answer: 0,
      why: 'Everything under a `"use client"` boundary ships JS and hydrates, so put the boundary at the leaf: the card stays a Server Component (zero JS) and renders the `LikeButton` Client Component with serializable props. **Not on ProductCard:** the whole static card would ship and hydrate for one button. **Not on the page:** even more of the tree becomes client JS. **Not in layout.tsx:** turns every page into a client bundle and loses most RSC benefits.',
    },
    {
      kind: 'flashcard',
      id: 'nx-f1',
      title: 'What is the RSC payload?',
      front: 'What is the RSC (Flight) payload, and why does it matter for performance?',
      back: `A compact, **streamed** serialization of the rendered Server Component tree: the output of server components, **slots** where client components go, and the serializable **props** for those client components.

The browser never downloads JS for server-only components, and because it streams, parts of the page appear while slower parts (inside Suspense) are still loading. Keep props passed to client components small.`,
    },
    {
      kind: 'flashcard',
      id: 'nx-f2',
      title: 'SSR vs CSR vs hydration',
      front: 'Compare CSR and SSR, and define hydration.',
      back: `**CSR**: the server sends an empty \`<div id="root">\`. Nothing is visible until JS downloads, runs and renders: late first paint, weaker SEO.
**SSR**: the server sends full HTML, so the user sees content immediately; JS loads afterwards.
**Hydration**: React walks the existing server DOM, attaches event handlers and state, and "takes over", without re-creating the DOM. Until it finishes, the page is visible but not interactive.`,
    },
    {
      kind: 'quiz',
      id: 'nx-r4',
      title: 'ssr: false',
      prompt: "What do you give up with `dynamic(() => import('./Chart'), { ssr: false })`?",
      options: [
        "The chart isn't in the server HTML: no SEO for it and a later first paint of that part",
        'Client-side interactivity',
        'The ability to use browser APIs',
        'Code splitting',
      ],
      answer: 0,
      why: "`ssr: false` skips server rendering for that component, so its markup isn't in the initial HTML: crawlers don't see it and it paints only after its JS loads. **Not interactivity:** it is a normal Client Component once loaded. **Not browser APIs:** client-only is exactly why you'd use it for window/canvas code. **Not code splitting:** `dynamic(import())` is code splitting.",
    },
  ],
};
