import { codeFiles, uiFiles } from '../../files';
import type { Topic } from '../../types';

const raw = import.meta.glob<string>('./files/*', { query: '?raw', import: 'default', eager: true });
const ui = uiFiles('machine-coding', raw);
const code = codeFiles('machine-coding', raw);

export const dataTopic: Topic = {
  slug: 'data',
  title: 'Data fetching & async (React)',
  questions: [
    {
      kind: 'ui',
      id: 'auto-complete',
      title: 'Debounced autocomplete',
      difficulty: 'hard',
      framework: 'react',
      prompt:
        'A search box that fetches suggestions as you type. The starter includes `mockFetch`, a stand-in API with random latency that honours `AbortSignal`.',
      requirements: [
        'Requests are debounced (~300ms)',
        "Stale requests are cancelled with `AbortController`, so out-of-order responses can't win",
        'Prefix matches are ranked before other matches',
        'Loading, empty ("no results") and error states',
        'An empty query clears results without a request',
        'Submitting the form uses the current query',
      ],
      ...ui('auto-complete'),
    },
    {
      kind: 'ui',
      id: 'user-list',
      title: 'Fetch a user list safely',
      difficulty: 'easy',
      framework: 'react',
      prompt: 'Fetch users from `https://jsonplaceholder.typicode.com/users` and render them, with loading and error states.',
      requirements: [
        'Loading, data and error live together in one state object',
        'The request is aborted on unmount (`AbortController`) and AbortError is ignored',
        'A non-OK HTTP status is treated as an error',
        'Each user shows name and email, keyed by id',
      ],
      ...ui('user-list'),
    },
    {
      kind: 'ui',
      id: 'hacker-news',
      title: 'Hacker News reader',
      difficulty: 'medium',
      framework: 'react',
      prompt: 'Show top stories from the public Hacker News API (`/v0/topstories.json`, then `/v0/item/{id}.json`), loading more on demand.',
      requirements: [
        'Fetch the id list once, then the stories of one page in parallel with `Promise.all`',
        '"Load more" appends the next page without refetching earlier ones',
        'Show title, domain, points and author; links open in a new tab safely (`rel="noopener"`)',
        'Loading and error states; the button is disabled while loading',
      ],
      ...ui('hacker-news'),
    },
    {
      kind: 'ui',
      id: 'infinite-scroll',
      title: 'Infinite scroll',
      difficulty: 'medium',
      framework: 'react',
      prompt: 'An infinitely scrolling list of users from `https://randomuser.me/api/?page=N&results=20&seed=...`.',
      requirements: [
        'An `IntersectionObserver` on the last item (or a sentinel) loads the next page',
        'Guard against duplicate concurrent fetches (a loading flag)',
        'Results are appended with a functional update',
        'The observer is disconnected and recreated when the last item changes (callback ref)',
        'An error message with a retry button, and a "back to top" button',
      ],
      ...ui('infinite-scroll'),
    },
    {
      kind: 'ui',
      id: 'fetch-with-retry',
      title: 'useFetchWithRetry hook',
      difficulty: 'medium',
      framework: 'react',
      prompt:
        'Write a generic `useFetchWithRetry<T>({ url, retries, delay })` hook returning `{ data, loading, error }`, and a small demo using the provided flaky API.',
      requirements: [
        'Treats a non-OK HTTP status as a failure (`fetch` only rejects on network errors)',
        'Retries up to `retries` times with `delay` between attempts, then reports the error',
        'Aborts the in-flight request AND clears a scheduled retry in the effect cleanup',
        'Ignores AbortError (no error state after unmount or a url change)',
        'Re-runs when `url`, `retries` or `delay` change; the hook is generic over the response type',
      ],
      ...ui('fetch-with-retry'),
    },
    {
      kind: 'ui',
      id: 'offline-image-cache',
      title: 'Offline image cache (IndexedDB)',
      difficulty: 'hard',
      framework: 'react',
      prompt: 'Let users add images that are stored in IndexedDB so they survive reloads and work offline, with search, delete, clear-all and storage usage.',
      requirements: [
        'Images are stored as Blobs in an IndexedDB object store (promisified open/put/getAll/delete)',
        'Rendering uses object URLs that are revoked on cleanup (no leaks)',
        'Search filters by name; delete and clear-all update the store and the UI',
        'Shows storage usage (`navigator.storage.estimate()` where available)',
        'Loading and error states for every async operation',
      ],
      ...ui('offline-image-cache'),
    },
    {
      kind: 'ui',
      id: 'data-table',
      title: 'Sortable, filterable data table with infinite scroll',
      difficulty: 'hard',
      framework: 'react',
      prompt:
        'Build a usage table over the provided fake API (`fetchUsage(query, offset, { signal, fail })`, 237 generated rows, 300-800ms latency, honours `AbortSignal`). Sorting, filtering and paging happen in the API; you implement its `compare` and the whole table. The follow-up quizzes review the take-home this is based on.',
      requirements: [
        '`compare` sorts numbers numerically, dates chronologically and strings with a locale-aware, case-insensitive collator',
        'Clicking a header sorts the WHOLE dataset by that column (via the API, restarting at page 1); clicking it again toggles asc/desc',
        'A labelled `<select>` filters by service; changing filter or sort aborts the in-flight request so a stale response can never win',
        'A single `IntersectionObserver` on a sentinel row loads the next page of 25: no scroll listener, no duplicate loads, and it stops at the end',
        'Loading, error with retry (the API\'s `fail` option simulates one), empty ("Analytics" has no rows) and end-of-list states',
        'Rows are keyed by record id, never index or a random id',
        'Each header is a `<button>` inside `<th scope="col">`, the sorted column has `aria-sort`, and the table has a `<caption>`',
      ],
      ...ui('data-table'),
    },
    {
      kind: 'code',
      id: 'sort-rows',
      title: 'sortRows: a correct table comparator',
      difficulty: 'medium',
      prompt: `\`sortRows(rows, key, dir = 'asc')\` returns the rows sorted by \`row[key]\`. The starter is the take-home's \`<\`/\`>\` comparator; make it correct:

- numbers numerically, and numeric strings as numbers (\`'9'\` before \`'10'\`)
- ISO date strings and \`Date\` objects chronologically, respecting time zone offsets
- other strings locale-aware and case-insensitive (\`'apple'\`, \`'banana'\`, \`'Cherry'\`, \`'Éclair'\`)
- \`null\` / \`undefined\` always last, in either direction
- stable (ties keep input order, also for \`'desc'\`) and the input array is not mutated`,
      ...code('sort-rows'),
    },
  ],
};
