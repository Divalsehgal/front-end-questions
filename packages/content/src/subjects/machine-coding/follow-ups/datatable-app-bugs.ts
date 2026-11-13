import type { Question } from '../../../types';

// "Spot the bugs", part two: the take-home's App (fetching, filter dropdown), types and markup.
export const datatableAppBugs: Question[] = [
  {
    kind: 'quiz',
    id: 'dt-bug-filter-race',
    title: 'Spot the bug: fast filter changes',
    difficulty: 'medium',
    prompt: 'The user picks "Storage" then quickly "Compute", and the Storage response arrives last. What is shown, and what is the fix?',
    code: `useEffect(() => {
  if (selectedValue === '') return;
  const fetchFilteredData = async () => {
    const res = await fetch(\`/api/resources/\${selectedValue}\`);
    setResourceData(await res.json());
  };
  fetchFilteredData();
}, [selectedValue]);`,
    options: [
      'Storage rows under the Compute filter; abort the request (or set an ignore flag) in the effect cleanup',
      'Compute rows, because React always keeps the most recent state',
      'Storage rows; add selectedValue to the dependency array',
      'Compute rows, because fetch responses arrive in the order the requests were sent',
    ],
    answer: 0,
    why: "Nothing cancels the old request, so whichever response lands LAST wins. Cancel it in cleanup:\n\n```js\nuseEffect(() => {\n  const controller = new AbortController();\n  fetch(url, { signal: controller.signal })\n    .then((r) => r.json())\n    .then(setRows)\n    .catch((e) => { if (e.name !== 'AbortError') setError(e); });\n  return () => controller.abort();\n}, [selectedValue]);\n```\n\nAn `ignore` flag set to true in cleanup also works (it drops the response but doesn't cancel the network call). A query library keyed by the filter does this for you. **Not most recent state:** the late response's `setState` IS the most recent update. **Not the dependency array:** `selectedValue` is already there. **Not request order:** separate HTTP requests can finish in any order.",
  },
  {
    kind: 'quiz',
    id: 'dt-bug-response-ok',
    title: 'Spot the bug: error handling for two fetches',
    difficulty: 'medium',
    prompt: 'Which statements about this error handling are true?',
    code: `try {
  const [resourcesRes, rawRes] = await Promise.all([
    fetch('/api/resources'),
    fetch('/api/raw'),
  ]);
  setResourceType((await resourcesRes.json()).map(toOption));
  setResourceData(await rawRes.json());
} catch (error) {
  console.log('Error:', error);
}`,
    options: [
      'A 404 whose body is a JSON error object is treated as success and stored as table rows',
      'On failure the user just sees an empty table: no error message and no retry',
      'If either request fails, the result of the other one is lost too',
      'fetch rejects on any non-2xx status, so the catch block already handles HTTP errors',
    ],
    answer: [0, 1, 2],
    why: '`fetch` only rejects on network failure, CORS or abort; a 404 or 500 resolves normally. Check `if (!res.ok) throw new Error("HTTP " + res.status)` before `.json()`, keep the error in state and render a message with a retry. `Promise.all` rejects on the first failure, so use `Promise.allSettled` (or two independent requests) when one half is useful alone. There is also no loading state. **Not fetch rejects on non-2xx:** it resolves with `ok: false`; only parsing an HTML error page would throw, and then only by accident.',
  },
  {
    kind: 'quiz',
    id: 'dt-bug-dropdown-shape',
    title: 'Spot the bug: option shape mismatch',
    difficulty: 'hard',
    prompt: 'App builds `{ key, label }` options but the Dropdown reads `option.value`. What value does `onChange` receive when a resource is picked?',
    code: `// App.tsx
const [resourceType, setResourceType] = useState([]);
setResourceType(resources.map((r: any, i: number) => ({ key: i, label: r })));
<Dropdown options={resourceType} value={selectedValue} onChange={setSelectedValue} />

// Dropdown.tsx
interface SelectOption { value: string; label: string }
{options.map((option, index) => (
  <option key={\`\${option.value}+\${index}\`} value={option.value}>{option.label}</option>
))}`,
    options: [
      'The label text: an option without a value attribute uses its text, so it works only by accident',
      'undefined, so the request goes to /api/resources/undefined',
      'The index, because React passes key through as the value',
      'An empty string for every option',
    ],
    answer: 0,
    why: 'React drops an attribute whose value is `undefined`, and an `<option>` with no `value` attribute reports its text content as its value. So it works while label and id happen to be equal, and breaks the moment they differ ("Virtual Machines" vs `vm`, or a translated label). TypeScript didn\'t catch it: `useState([])` infers `never[]` and `res.json()` returns `any`, so both shapes compile. Fix: one shared `Option` type, map to `{ value: r, label: r }`, and type the state `useState<Option[]>([])`. **Not undefined:** the DOM falls back to the text. **Not the index:** `key` is React-only and never reaches the DOM. **Not an empty string:** only the placeholder option has `value=""`.',
  },
  {
    kind: 'quiz',
    id: 'dt-bug-loose-types',
    title: 'Spot the bug: types that hide bugs',
    difficulty: 'medium',
    prompt: 'Which of these typing choices let real bugs compile?',
    code: `interface TableColumn { key: string; label: string }
const [resourceData, setResourceData] = useState<TableColumn[]>([]);
setResourceData(await rawRes.json()); // usage records, not columns

// Table.tsx
interface TableData { [key: string]: any }
<td>{row[column.key]}</td>`,
    options: [
      'resourceData holds usage records but is typed as column definitions; res.json() returns any, so it is accepted',
      'The any index signature lets a cell be an object (a runtime crash) or a mixed type in the sort, with no error',
      'column.key is a plain string, so a typo in a column key compiles and renders an empty column',
      'An any index signature is required because API data is dynamic; unknown would not compile',
    ],
    answer: [0, 1, 2],
    why: '`any` switches checking off wherever it flows. Type the record (`type Usage = { id: string; cost: number; date: string; ... }`), make the table generic (`Column<T> = { key: keyof T & string; label: string }`, `Table<T>`), and validate JSON at the boundary (a schema library or a type guard) so `any` stops there. **Not required for dynamic data:** `Record<string, unknown>` compiles fine; you narrow a value before rendering it, which is exactly the check `any` skips.',
  },
  {
    kind: 'quiz',
    id: 'dt-bug-th-a11y',
    title: 'Spot the bug: a clickable table header',
    difficulty: 'easy',
    prompt: 'What is wrong with this sortable header for keyboard and screen-reader users?',
    code: `<th onClick={() => handleSort(column.key)}>
  {column.label}
  {sortedColumn === column.key && <span>{sortDirection === 'asc' ? ' ▲' : ' ▼'}</span>}
</th>`,
    options: [
      'It cannot be focused or activated from the keyboard',
      'The sort state is not exposed: there is no aria-sort, only a glyph',
      'Nothing tells assistive tech that it is clickable: it has no button role',
      'Adding tabIndex={0} to the th fully fixes it',
    ],
    answer: [0, 1, 2],
    why: "A `<th>` isn't interactive. Put a real button inside it and expose the state on the header cell:\n\n```tsx\n<th scope=\"col\" aria-sort={active ? (dir === 'asc' ? 'ascending' : 'descending') : undefined}>\n  <button type=\"button\" onClick={() => sortBy(col.key)}>\n    {col.label} <span aria-hidden=\"true\">{active ? (dir === 'asc' ? '▲' : '▼') : ''}</span>\n  </button>\n</th>\n```\n\nSet `aria-sort` on the sorted column only, and give the table a `<caption>`. **Not tabIndex:** it makes the cell focusable, but Enter and Space still do nothing and it still has no button role; a `<button>` gives you all three for free.",
  },
  {
    kind: 'quiz',
    id: 'dt-bug-derived-state',
    title: 'Spot the bug: derived state synced by an effect',
    difficulty: 'medium',
    prompt: 'What is the problem with `totalItems`?',
    code: `const [totalItems, setTotalItemsLength] = useState(0);
const [displayData, setDisplayData] = useState<TableData[]>([]);

useEffect(() => {
  setTotalItemsLength(data?.length);
  setDisplayData(data.slice(0, itemsPerPage));
}, [data, itemsPerPage]);`,
    options: [
      'It is derived from props, so compute it in render (data.length); the effect adds an extra render where it is out of sync',
      'Nothing: copying props into state with an effect is the recommended pattern',
      'It should be a ref, to avoid re-rendering',
      'It should be wrapped in useMemo',
    ],
    answer: 0,
    why: 'Anything you can calculate from props or state should be calculated during render. Here the first render after new `data` still shows the old count, then the effect fixes it with a second render. Paging that must restart on new data (`currentPage` is never reset here!) belongs in the event that changes the filter, or remount the table with `key={filter}`. (`data?.length` next to `data.slice` is also inconsistent: if `data` could be undefined, `slice` throws anyway.) **Not the recommended pattern:** React\'s docs list it under "You might not need an effect". **Not a ref:** a ref wouldn\'t update the UI and still duplicates the data. **Not useMemo:** `.length` is free; memoize only expensive calculations.',
  },
];
