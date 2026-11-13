import { datatableAppBugs } from './datatable-app-bugs';
import { datatableTableBugs } from './datatable-table-bugs';
import type { Topic } from '../../../types';

export const followUps: Topic = {
  slug: 'follow-ups',
  title: 'Machine-coding follow-up questions',
  questions: [
    {
      kind: 'flashcard',
      id: 'fu-f1',
      title: 'Follow-ups interviewers ask after you build it',
      front:
        'You finished the widget. What follow-ups should you be ready for on: a progress bar, overlapping circles, an OTP input, a reducer todo, a word-frequency counter, a carousel and a mention box?',
      back: `- **Progress bar**: a circular version: SVG circle with \`stroke-dasharray\` = circumference and \`stroke-dashoffset\` = circumference × (1 − progress).
- **Overlapping circles**: thousands of circles make pairwise checks O(n²); use spatial partitioning (a grid or a **quadtree**) to compare only nearby circles.
- **OTP input**: \`autoComplete="one-time-code"\`, numeric input mode, paste support, rate limiting, and masking on shared screens.
- **Reducer todo**: Context + \`useReducer\` is a lightweight Redux; use a store with selectors once re-renders hurt.
- **Word frequency**: count in a \`Map\` (or \`Object.create(null)\`), not \`{}\`, so words like "constructor" don't collide with prototype keys.
- **Carousel**: preload the next slide, support swipe with pointer events, and pause autoplay on hover and focus.
- **Mention box**: position the list with a floating-UI library, and use the combobox pattern (\`role="listbox"\`, \`aria-activedescendant\`) for keyboard users.`,
    },
    {
      kind: 'flashcard',
      id: 'dt-f-infinite-scroll',
      title: 'Infinite scroll checklist',
      difficulty: 'medium',
      front: 'You are adding infinite scroll to a list or table. What is on your checklist?',
      back: `- **One trigger**: a sentinel row watched by a single \`IntersectionObserver\` (\`root\` = the scroll container if there is one, \`rootMargin\` to prefetch). No scroll listener.
- **Guard with current state**: "load more" is ignored unless idle and \`hasMore\`; do it in a reducer or ref, not a value captured in a closure.
- **\`hasMore\` in one unit**: rows loaded < total, or "the server returned a next cursor". Stop observing at the end.
- **Short first page**: re-observing a visible sentinel fires straight away, so re-attach after each load and the next page follows.
- **Filter / sort change**: abort the in-flight request, reset to page 1, clear rows.
- **Stable order**: offset paging needs a total order (tie-break on id), or use cursor pagination when rows are inserted live.
- **States**: loading, error with retry, empty, end of list. Keys from data ids.
- **Scale and a11y**: virtualise thousands of rows; announce loads in a \`role="status"\` region; offer a "Load more" button fallback.`,
    },
    {
      kind: 'flashcard',
      id: 'dt-f-sortable-table',
      title: 'Sortable table: comparator and markup',
      difficulty: 'medium',
      front: 'What makes a sortable data table correct, both the sort itself and the header markup?',
      back: `- **Sort, then paginate**: sort the whole dataset (or send the sort to the server and restart at page 1), never just the loaded rows.
- **Compare by type**: numbers with \`a - b\`, dates by timestamp, strings with \`Intl.Collator\` (case- and accent-aware); empty values last in both directions.
- **Stable**: \`Array.prototype.sort\` is stable since ES2019; for desc flip the sign rather than reversing, and copy first (\`[...rows]\` or \`toSorted\`).
- **Toggle**: same column flips asc/desc, a new column starts asc.
- **Markup**: \`<th scope="col">\` containing a \`<button type="button">\`; \`aria-sort\` on the sorted header only; arrow glyph \`aria-hidden\`; a \`<caption>\` naming the table and current sort.`,
    },
    ...datatableTableBugs,
    ...datatableAppBugs,
  ],
};
