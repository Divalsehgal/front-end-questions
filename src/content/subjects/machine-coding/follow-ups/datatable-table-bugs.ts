import type { Question } from '../../../types';

// "Spot the bugs" in a real take-home: a sortable, infinitely scrolling <Table> (React + TS).
// The snippets are trimmed from the original code; the matching build is machine-coding/data-table.
export const datatableTableBugs: Question[] = [
  {
    kind: 'quiz',
    id: 'dt-bug-uuid-keys',
    title: 'Spot the bug: uuid keys in render',
    difficulty: 'easy',
    prompt: 'What happens to these rows every time the table re-renders (a page loads, a header is clicked)?',
    code: `{sortedData.map((row, index) => {
  const rowId = uuidv4();
  return (
    <tr key={rowId} ref={index === sortedData.length - 1 ? lastElementRef : null}>
      {columns.map((column) => (
        <td key={\`\${rowId}-\${column.key}\`}>{row[column.key]}</td>
      ))}
    </tr>
  );
})}`,
    options: [
      'Every row unmounts and remounts, because no key matches the previous render',
      'Nothing: keys only need to be unique among siblings, and uuids are unique',
      'React reuses the rows by position because all the keys are strings',
      'React logs a duplicate-key warning',
    ],
    answer: 0,
    why: "Keys must be unique AND stable across renders. A fresh uuid per render never matches last render's key, so React destroys every `<tr>` and builds new DOM: slow for long lists, and focus, selection and any row state are lost. Use the record's id (`key={row.id}`); if the data has none, assign ids once when it arrives, never during render. **Not unique is enough:** uniqueness without stability is exactly what forces the remount. **Not reuses by position:** a key that doesn't match is a new element; position only matters with no keys or index keys. **Not duplicate-key warning:** uuids never collide, so React stays silent, which is why this survives review.",
  },
  {
    kind: 'quiz',
    id: 'dt-bug-stale-observer',
    title: 'Spot the bug: stale closures in the observer',
    difficulty: 'hard',
    prompt:
      'The observer callback calls `loadMoreData`, which reads `currentPage`, `displayData` and `data`, but the effect only lists `[isFetching, totalItems]`. Which statements are true?',
    code: `const loadMoreData = () => {
  if (currentPage < totalItems && !isFetching) {
    setIsFetching(true);
    setTimeout(() => {
      const start = currentPage * itemsPerPage;
      setDisplayData([...displayData, ...data.slice(start, start + itemsPerPage)]);
      setCurrentPage(currentPage + 1);
      setIsFetching(false);
    }, 1000);
  }
};

useEffect(() => {
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) loadMoreData();
  });
  if (lastElementRef.current) observer.observe(lastElementRef.current);
  return () => observer.disconnect();
}, [isFetching, totalItems]);`,
    options: [
      'It only works by accident: isFetching flips after every load, which happens to re-create the observer with a fresh loadMoreData',
      'If a new filter returns a different data array of the same length, the observer can keep slicing the old array',
      'The setTimeout callback writes displayData from the render that scheduled it, overwriting anything that changed during that second',
      'Effects always read the latest props and state, so a stale closure is impossible here',
    ],
    answer: [0, 1, 2],
    why: "A closure sees the values of the render that created it. The deps don't list what the callback reads, so correctness depends on `isFetching` toggling. Robust fixes: functional updates (`setRows(prev => [...prev, ...next])`, `setPage(p => p + 1)`), or a reducer so the observer only dispatches `loadMore` and the reducer decides with current state. `useEffectEvent` (stable in React 19.2) also gives an effect a non-reactive callback that reads the latest values. `react-hooks/exhaustive-deps` flags the missing deps. **Not effects read the latest values:** each effect run captures one render's values; that is the whole stale-closure problem.",
  },
  {
    kind: 'quiz',
    id: 'dt-bug-cleartimeout',
    title: 'Spot the bug: clearTimeout on a fresh local',
    difficulty: 'easy',
    prompt: 'What does `clearTimeout(timer)` cancel?',
    code: `const loadMoreData = () => {
  let timer = 0;
  clearTimeout(timer);
  if (currentPage < totalItems && !isFetching) {
    setIsFetching(true);
    timer = setTimeout(() => {
      /* append the next page */
    }, 1000);
  }
};`,
    options: [
      'Nothing: timer is a new local set to 0 on every call, so no earlier timeout is ever cancelled',
      'The timeout scheduled by the previous call to loadMoreData',
      'Every pending timeout on the page',
      'It throws, because 0 is not a valid timer id',
    ],
    answer: 0,
    why: "Each call gets its own `timer`; the previous call's id is gone. To cancel a timeout later, keep the id somewhere that outlives the call (`timerRef.current`) and also clear it in an effect cleanup so it can't fire after unmount. **Not the previous call's timeout:** that id was in a different call's local variable. **Not every pending timeout:** `clearTimeout` clears only the id you pass. **Not it throws:** unknown or invalid ids are silently ignored.",
  },
  {
    kind: 'quiz',
    id: 'dt-bug-pages-vs-items',
    title: 'Spot the bug: comparing pages to items',
    difficulty: 'medium',
    prompt: '95 rows, 20 per page, `currentPage` starts at 1 and `totalItems` is `data.length`. When does loading stop?',
    code: `if (currentPage < totalItems && !isFetching) {
  /* load page currentPage + 1 */
}

{currentPage < totalItems && (
  <tfoot><tr><td>{isFetching ? 'loading...' : ''}</td></tr></tfoot>
)}`,
    options: [
      'Only when currentPage reaches 95, so it keeps "loading" empty pages long after all rows are shown',
      'After page 5, when all 95 rows are shown',
      'After page 4, so the last 15 rows never appear',
      'Immediately, because currentPage starts at 1',
    ],
    answer: 0,
    why: 'The condition compares a page count with a row count. After page 5 every row is shown, but `5 < 95`, so each intersection schedules another one-second load of an empty slice, and since re-observing a visible element fires straight away it loops while the bottom is on screen. Derive the end in one unit: `hasMore = displayData.length < data.length` (or `currentPage < Math.ceil(total / perPage)`), and stop observing when it is false. **Not after page 5:** that is what the author meant, not what the code checks. **Not after page 4:** the bug loads too much, not too little. **Not immediately:** `1 < 95` is true.',
  },
  {
    kind: 'quiz',
    id: 'dt-bug-double-trigger',
    title: 'Spot the bug: scroll listener plus IntersectionObserver',
    difficulty: 'medium',
    prompt: 'Both a scroll listener and an IntersectionObserver call `loadMoreData`. What is the best fix?',
    code: `const handleScroll = () => {
  if (lastElementRef.current &&
      lastElementRef.current.getBoundingClientRect().bottom <= window.innerHeight) {
    loadMoreData();
  }
};
const observer = new IntersectionObserver(([entry]) => {
  if (entry.isIntersecting) loadMoreData();
}, { threshold: 0.1 });

observer.observe(lastElementRef.current);
window.addEventListener('scroll', handleScroll);`,
    options: [
      'Keep only the IntersectionObserver on a sentinel row, and make "load more" a no-op unless idle with rows left',
      'Keep only the scroll listener, throttled, because it is more reliable',
      'Keep both, but debounce loadMoreData by 200ms',
      'Keep both: the isFetching check already prevents duplicate loads',
    ],
    answer: 0,
    why: "The observer already reports when the sentinel enters view, asynchronously and without layout reads. Two triggers can both call `loadMoreData` before the re-render that sets `isFetching`, and both closures still see `false`, so two loads start. Put the guard where it sees current state (a reducer that ignores `loadMore` unless idle, or a ref). **Not the scroll listener:** it reads layout on every scroll event, and if the first page doesn't fill the screen nothing scrolls, so it never loads. **Not debounce:** it adds latency and hides the race instead of removing it. **Not the isFetching check:** it reads state captured in each closure, which doesn't change until React re-renders.",
  },
  {
    kind: 'quiz',
    id: 'dt-bug-sort-loaded-only',
    title: 'Spot the bug: sorting only the loaded rows',
    difficulty: 'medium',
    prompt: '20 of 500 rows are loaded and the user sorts Cost descending. What do they see?',
    code: `const sortedData = sortedColumn
  ? [...displayData].sort((a, b) => {
      if (a[sortedColumn] < b[sortedColumn]) return sortDirection === 'asc' ? -1 : 1;
      if (a[sortedColumn] > b[sortedColumn]) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    })
  : displayData;`,
    options: [
      'The 20 loaded rows reordered; as more pages load, pricier rows appear above the ones already seen',
      'The 20 most expensive rows of all 500',
      'All 500 rows sorted, because sortedData is recomputed every render',
      'An error, because displayData is state and cannot be copied',
    ],
    answer: 0,
    why: 'Sort first, then paginate: sort the whole dataset and slice it (client side), or send the sort to the server and restart from page 1. The `<` comparator has its own bugs too: numeric strings compare as text ("10" < "9"), non-ISO dates compare as text, and case matters ("Z" < "a"). **Not the 20 most expensive:** only loaded rows take part in the sort. **Not all 500 sorted:** recomputing still sorts only `displayData`. **Not an error:** spreading state into a new array is the correct way to sort without mutating it.',
  },
];
