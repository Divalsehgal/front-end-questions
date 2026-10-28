import type { Topic } from '../../types';

export const routingState: Topic = {
  slug: 'routing-state',
  title: 'Layouts, routing & state',
  questions: [
    {
      kind: 'quiz',
      id: 'nx-l1',
      title: 'Layout vs template',
      prompt: "You navigate between two pages that share a `layout.tsx` containing a sidebar with a search input. What happens to the input's text?",
      options: [
        "It is preserved: layouts don't re-mount; only the page segment swaps",
        'It resets: every navigation re-mounts the layout',
        'It resets unless you use `template.tsx`',
        'The whole document reloads',
      ],
      answer: 0,
      why: "A `layout.tsx` stays mounted across navigations within its segment; only the page segment below it swaps, so the input's client state survives. **Not 'every navigation re-mounts the layout':** that is the defining difference from templates. **Not 'resets unless template.tsx':** backwards, `template.tsx` is what re-mounts on each navigation. **Not a full reload:** App Router navigation is client-side.",
    },
    {
      kind: 'quiz',
      id: 'nx-l2',
      title: 'Where filter state should live',
      prompt: 'Product filters (category, sort, page): Context or URL search params?',
      options: [
        'URL search params: shareable, survive refresh, work with back/forward, crawlable, and readable by the server page',
        "Context, because it's global",
        'localStorage',
        'A Redux slice',
      ],
      answer: 0,
      why: "Filters change what data is shown, so they belong in the URL: shareable, survive refresh, work with back/forward, crawlable, and `page.tsx` can read `searchParams` on the server to fetch the filtered data. **Not Context:** lost on refresh and invisible to the server and to links. **Not localStorage:** not shareable, not server-readable, and causes hydration mismatches. **Not a Redux slice:** same problems as Context with more boilerplate. Context suits app-wide state that shouldn't be in the URL (cart, auth).",
    },
    {
      kind: 'quiz',
      id: 'nx-l3',
      title: 'Fetching in layouts',
      prompt: 'Why avoid fetching frequently changing data in `layout.tsx`?',
      options: [
        "Layouts don't re-render on client navigation within their segment, so the data can go stale",
        'Layouts cannot be async',
        'Layouts run on the client only',
        'It causes a hydration error',
      ],
      answer: 0,
      why: "Layouts persist and don't re-render on client navigation within their segment, so data they fetched can stay stale while child pages change; fetch volatile data in the page or a component inside it. **Not 'layouts cannot be async':** layouts can be async Server Components. **Not 'client only':** they are Server Components by default. **Not hydration errors:** stale data isn't a server/client mismatch.",
    },
    {
      kind: 'quiz',
      id: 'nx-l4',
      title: 'Updating search params',
      prompt: 'In a Client Component, how do you set `?category=shoes` without losing other params, and how does the page read it in Next 15+?',
      options: [
        "`const params = new URLSearchParams(useSearchParams()); params.set('category', 'shoes'); router.push(`${usePathname()}?${params}`)`; the page awaits its `searchParams` prop (it is a Promise in Next 15)",
        "`window.location.search = 'category=shoes'`, and the page reads `window.location`",
        'Put it in Context and read it with `useContext` in the page',
        "`router.push('?category=shoes')`, and the page reads `props.searchParams.category` synchronously",
      ],
      answer: 0,
      why: "Copy the current params (`new URLSearchParams(useSearchParams())`) so other filters survive, `set` the one you need, then `router.push` (or `replace`) to `pathname?params`; since Next 15 the page's `searchParams` prop is a Promise you `await`. **Not window.location.search:** triggers a full page reload. **Not Context:** the server page can't read Context and the URL isn't updated. **Not router.push('?category=shoes') + sync read:** it drops other params, and synchronous `searchParams` access is the pre-15 API.",
    },
    {
      kind: 'quiz',
      id: 'nx-l5',
      title: 'Link prefetching and metadata',
      prompt: 'Which statements about `<Link>` and the Metadata API are true?',
      options: [
        'In production, `<Link>` prefetches routes as they scroll into view, so navigation feels instant',
        'Server Components can export `metadata` (or `generateMetadata`) to set title and Open Graph tags without client JS',
        '`<Link>` is required for any anchor, including external sites',
        'Metadata must be set with `document.title` in an effect',
      ],
      answer: [0, 1],
      why: "In production `<Link>` prefetches routes as they enter the viewport (static routes fully, dynamic ones up to the nearest `loading.js`), and Server Components can export `metadata`/`generateMetadata` so tags are in the server HTML with no client JS. **Not 'Link required for external sites':** use a plain `<a>` for external links. **Not document.title in an effect:** that runs only on the client, too late for crawlers and link previews.",
    },
    {
      kind: 'flashcard',
      id: 'nx-lf1',
      title: 'State localization rules',
      front: 'In a Next.js app, how do you decide where a piece of state lives?',
      back: `1. **Server first**: if it can be computed on the server from the request (params, cookies, DB), don't make it state at all.
2. **URL** for anything that changes what is displayed and should be shareable (filters, tabs, pagination).
3. **Local component state** for UI-only interaction (open/closed, input drafts), at the lowest component that needs it.
4. **Context in the root layout** only for truly global, interactive state (cart, auth, theme).`,
    },
  ],
};
