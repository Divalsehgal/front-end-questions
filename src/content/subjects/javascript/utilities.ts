import { codeFiles } from '../../files';
import type { Topic } from '../../types';

const code = codeFiles('javascript', import.meta.glob<string>('./files/*', { query: '?raw', import: 'default', eager: true }));

export const utilities: Topic = {
  slug: 'utilities',
  title: 'Utilities & polyfills',
  questions: [
    {
      kind: 'code',
      id: 'flatten',
      title: 'Flatten to depth, iteratively',
      difficulty: 'medium',
      prompt: `Flatten \`arr\` to \`depth\` levels **without** \`.flat()\` and **without recursion** (use a stack).

- default depth is 1; \`Infinity\` flattens fully; \`0\` returns a shallow copy
- keep order; don't mutate the input

Be ready to state the time and space complexity.`,
      ...code('flatten'),
    },
    {
      kind: 'code',
      id: 'get-by-path',
      title: 'getByPath (lodash.get)',
      difficulty: 'easy',
      prompt: `\`getByPath(obj, 'a.b[0].c', defaultValue)\`, also accepting an array path like \`['a', 'b', 0, 'c']\`.

- return \`defaultValue\` only when the result is \`undefined\` (\`null\` and \`0\` are real values)
- never throw on \`null\`/\`undefined\` along the way
- an empty path returns the object itself

Bonus: infer the return type from the string path with template literal types.`,
      ...code('get-by-path'),
    },
    {
      kind: 'code',
      id: 'lru-cache',
      title: 'LRU cache, O(1)',
      difficulty: 'medium',
      prompt: `\`new LRUCache<K, V>(capacity)\` with O(1) \`get\` and \`put\`.

- \`get\` returns the value or \`undefined\`; a hit makes the key most-recently-used
- \`put\` inserts or updates (an update also refreshes it); over capacity → evict the least-recently-used
- \`size\` returns the entry count

Be ready to explain **why** a \`Map\` gives you this for free, and how you'd build it without one (hash map + doubly linked list).`,
      ...code('lru-cache'),
    },
    {
      kind: 'code',
      id: 'event-emitter',
      title: 'Type-safe event emitter',
      difficulty: 'hard',
      prompt: `Build an emitter whose events and payloads are typed from an event map:

\`\`\`
type Events = { login: { userId: string }; logout: void };
const e = new Emitter<Events>();
e.on('login', (p) => p.userId);   // p is typed
e.emit('logout');                 // no payload for void events
e.emit('login', { id: 1 });       // compile error
\`\`\`

- \`on\` and \`once\` return an unsubscribe function; \`off\` removes a listener
- listeners run in subscription order
- a listener that unsubscribes itself during \`emit\` must not make that emit skip the next listener

Hint for \`emit\`: a rest tuple such as \`...args: EventMap[K] extends void ? [] : [EventMap[K]]\`.`,
      ...code('event-emitter'),
    },
    {
      kind: 'code',
      id: 'array-polyfills',
      title: 'map, filter and reduce polyfills',
      difficulty: 'medium',
      prompt: `Implement \`Array.prototype.myMap\`, \`myFilter\` and \`myReduce\` without the native versions.

- callbacks get \`(value, index, array)\`; \`map\`/\`filter\` honour \`thisArg\`
- **holes** in sparse arrays are skipped (check with \`i in this\`)
- \`myReduce\` with no initial value starts from the first element, and throws \`TypeError\` on an empty array
- an explicit \`undefined\` initial value still counts as an initial value (hint: rest parameters)`,
      ...code('array-polyfills'),
    },
    {
      kind: 'code',
      id: 'pipe',
      title: 'pipe and compose',
      difficulty: 'easy',
      prompt:
        '`pipe(f, g, h)(x)` is `h(g(f(x)))`; `compose` is the same right-to-left. The first function may take several arguments; with no functions, return the input unchanged.',
      ...code('pipe'),
    },
    {
      kind: 'code',
      id: 'partial',
      title: 'Partial application',
      difficulty: 'easy',
      prompt:
        '`partial(fn, ...preset)` returns a function that calls `fn` with the preset arguments followed by the new ones, keeping `this`. How is this different from `curry`?',
      ...code('partial'),
    },
    {
      kind: 'code',
      id: 'chunk',
      title: 'chunk',
      difficulty: 'easy',
      prompt: "Split an array into groups of `size` (default 1). The last group holds the remainder. Don't mutate the input.",
      ...code('chunk'),
    },
    {
      kind: 'code',
      id: 'group-by',
      title: 'groupBy and countBy',
      difficulty: 'easy',
      prompt:
        '`groupBy(arr, iteratee)` and `countBy(arr, iteratee)`, where `iteratee` is a function or a property name (like lodash). Keep the original order inside each group.',
      ...code('group-by'),
    },
    {
      kind: 'code',
      id: 'flatten-object',
      title: 'Flatten a nested object',
      difficulty: 'medium',
      prompt: `\`{ user: { name: 'John', address: { city: 'NYC' } } }\` → \`{ 'user.name': 'John', 'user.address.city': 'NYC' }\`.

- array items use their index: \`{ tags: ['a'] }\` → \`{ 'tags.0': 'a' }\`
- \`null\` is a value (watch \`typeof null === 'object'\`); Dates are values too
- empty nested objects produce no keys`,
      ...code('flatten-object'),
    },
    {
      kind: 'code',
      id: 'replace-placeholders',
      title: 'Replace {{placeholders}} deeply',
      difficulty: 'medium',
      prompt:
        "Replace every `{{key}}` (spaces inside the braces allowed) in any string inside a nested object/array template with `values[key]`; unknown keys become `''`. Return a new structure; don't mutate the template.",
      ...code('replace-placeholders'),
    },
    {
      kind: 'code',
      id: 'symmetric-difference',
      title: 'Symmetric difference',
      difficulty: 'easy',
      prompt:
        'Return the symmetric difference of any number of arrays, applied pairwise left to right, with no duplicates and in order of first appearance: `sym([1, 2, 5], [2, 3, 5], [3, 4, 5])` → `[1, 4, 5]`.',
      ...code('symmetric-difference'),
    },
    {
      kind: 'code',
      id: 'expect-matchers',
      title: 'expect().toBe() chain',
      difficulty: 'easy',
      prompt:
        'Write a tiny Jest-style `expect(actual)` returning `toBe`, `notToBe` and `toEqual` (deep). Each returns `true` or throws an Error with the message `Not Equal` / `Equal` / `Not Deep Equal`.',
      ...code('expect-matchers'),
    },
    {
      kind: 'code',
      id: 'array-polyfills-2',
      title: 'at, find, findIndex, every, some, fill',
      difficulty: 'easy',
      prompt:
        'Re-implement six array methods as standalone functions (the native ones are disabled in the tests). Watch the edge cases: negative indexes, empty arrays (every → true, some → false), and short-circuiting.',
      ...code('array-polyfills-2'),
    },
    {
      kind: 'code',
      id: 'object-string-utils',
      title: 'pick, omit, capitalize, reverse, split',
      difficulty: 'easy',
      prompt:
        'Five small utilities: typed `pick`/`omit`, `capitalize`, `reverse` (strings, and numbers keeping their sign), and `mySplit` without `String.prototype.split` (multi-character separators and empty segments included).',
      ...code('object-string-utils'),
    },
    {
      kind: 'code',
      id: 'warmups',
      title: 'Pyramid pattern & inventory update',
      difficulty: 'easy',
      prompt:
        'Print a centred `#` pyramid as a string, then solve freeCodeCamp\'s "Inventory Update": merge two inventories, adding quantities by name, sorted alphabetically, without mutating the inputs.',
      ...code('warmups'),
    },
    {
      kind: 'output',
      id: 'ut-o1',
      title: 'Iterating a Map',
      code: `const students = new Map([
  ['stu1', 'maths'],
  ['stu2', 'science'],
]);
for (const [id, subject] of students) console.log(id, subject);
const map = new Map([[150, 'abc'], [120, 'def']]);
console.log(map.entries().next().value, map.keys().next(), [...map.values()]);
console.log(map.size, map.get(150), map.get('150'));`,
      why: "Maps iterate in INSERTION order (not sorted, unlike integer-like object keys). Iterating a Map gives [key, value] pairs. Keys are compared with SameValueZero, so 150 and '150' are different keys, which a plain object would merge.",
    },
    {
      kind: 'output',
      id: 'ut-o2',
      title: 'arguments and a promise that resolves synchronously',
      code: `function foo() {
  const args = Array.prototype.slice.call(arguments);
  console.log(args[1], arguments.length, Array.isArray(arguments));
}
foo(1, 2, 4);

let a, b;
const p = new Promise((res) => {
  a = setTimeout(() => res('hi'));
  b = setTimeout(() => res('hello'));
  res(3);
});
clearTimeout(a);
p.then((v) => console.log('result', v));`,
      why: "`arguments` is array-LIKE (has length, isn't an Array), so borrow slice or use rest parameters instead. The executor's synchronous res(3) settles the promise first; the timer resolves would be ignored even if they ran.",
    },
    {
      kind: 'code',
      id: 'concat-foreach',
      title: 'concat and forEach polyfills',
      difficulty: 'easy',
      prompt:
        '`concat(base, ...items)` returns a new array, flattening array arguments one level only; `forEach(arr, cb, thisArg)` calls back with (value, index, array), skips holes and returns undefined.',
      ...code('concat-foreach'),
    },
  ],
};
