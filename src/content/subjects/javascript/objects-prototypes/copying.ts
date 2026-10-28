import { codeFiles } from '../../../files';
import type { Question } from '../../../types';

const code = codeFiles('javascript', import.meta.glob<string>('../files/*', { query: '?raw', import: 'default', eager: true }));

export const copyingQuestions: Question[] = [
  {
    kind: 'output',
    id: 'cp-1',
    title: 'spread vs structuredClone',
    code: `const original = { a: 1, nested: { b: 2 }, list: [1] };
const spread = { ...original };
const cloned = structuredClone(original);
spread.a = 100;
spread.nested.b = 200;
cloned.list.push(2);
console.log(original.a, original.nested.b, original.list.length);`,
    why: 'Spread is a SHALLOW copy: top-level a is copied, but `nested` is the same object, so 200 leaks into original. structuredClone is deep, so pushing to its list does not affect the original.',
  },
  {
    kind: 'output',
    id: 'cp-2',
    title: 'what JSON round-tripping loses',
    code: `const src = { d: new Date(0), u: undefined, f() {}, n: NaN, s: new Set([1]) };
const copy = JSON.parse(JSON.stringify(src));
console.log(typeof copy.d, 'u' in copy, 'f' in copy, copy.n, copy.s);`,
    why: 'JSON: Date → ISO string, undefined and functions are dropped, NaN/Infinity → null, Set/Map → {}. structuredClone keeps Date/Map/Set but throws on functions.',
  },
  {
    kind: 'output',
    id: 'cp-3',
    title: 'Object.freeze in strict mode',
    code: `const cfg = Object.freeze({ level: 1, inner: { level: 1 } });
try {
  cfg.level = 2;
} catch (e) {
  console.log(e.name);
}
cfg.inner.level = 2;
console.log(cfg.level, cfg.inner.level);`,
    why: 'Writing to a frozen object throws TypeError in strict mode (silently ignored in sloppy). freeze is SHALLOW: inner is still mutable.',
  },
  {
    kind: 'output',
    id: 'cp-4',
    title: 'reference equality, NaN lookups, Set',
    code: 'console.log([1, 2] === [1, 2], [NaN].includes(NaN), [NaN].indexOf(NaN), new Set([NaN, NaN, 0, -0]).size);',
    why: 'Objects compare by reference. includes uses SameValueZero (finds NaN); indexOf uses === (cannot). Set also uses SameValueZero: NaNs collapse, 0 and -0 are the same → size 2.',
  },
  {
    kind: 'quiz',
    id: 'q-obj-1',
    title: 'structuredClone limits',
    prompt: 'Which value makes `structuredClone` THROW?',
    options: ['An object containing a function', 'A Map of Dates', 'An object with a circular reference', 'A Set of NaN'],
    answer: 0,
    why: "`structuredClone` throws a `DataCloneError` for values it can't serialize, notably functions (and DOM nodes, symbols). **Not a Map of Dates:** Map and Date are both supported. **Not a circular reference:** cycles are preserved, unlike JSON. **Not a Set of NaN:** Set and NaN clone fine. Class instances don't throw but come back as plain objects (prototype lost).",
  },
  {
    kind: 'quiz',
    id: 'q-obj-2',
    title: 'Object.freeze',
    prompt: '`const cfg = Object.freeze({ a: { b: 1 } }); cfg.a.b = 2;` What happens?',
    options: ['cfg.a.b becomes 2: freeze is shallow', 'TypeError in strict mode', 'cfg.a.b stays 1 silently', 'cfg is unfrozen'],
    answer: 0,
    why: "`Object.freeze` is shallow: it locks `cfg`'s own properties, but `cfg.a` is a separate, unfrozen object, so writing `cfg.a.b` succeeds. **Not TypeError in strict mode:** only writes to a frozen object's own properties (e.g. `cfg.a = {}`) throw. **Not 'stays 1 silently':** that is sloppy-mode behaviour for writes to frozen properties, which this isn't. **Not 'cfg is unfrozen':** freezing is permanent. Use a recursive deepFreeze for nested data.",
  },
  {
    kind: 'quiz',
    id: 'q-obj-3',
    title: 'instanceof',
    prompt: 'What does `x instanceof F` actually check?',
    options: [
      "Whether `F.prototype` appears anywhere in `x`'s prototype chain",
      'Whether x was created by calling new F',
      'Whether x.constructor === F',
      'Whether F has a property x',
    ],
    answer: 0,
    why: "`instanceof` walks `x`'s prototype chain (`Object.getPrototypeOf` repeatedly) looking for the current `F.prototype` object (customisable via `Symbol.hasInstance`). **Not 'created by new F':** reassign `F.prototype` and old instances fail; `Object.create(F.prototype)` passes without `new`. **Not x.constructor === F:** `constructor` is an ordinary, overwritable property and isn't consulted. **Not 'F has property x':** that is the `in` operator.",
  },
  {
    kind: 'quiz',
    id: 'q-obj-4',
    title: 'Class fields and inheritance',
    prompt: "When are a subclass's class fields initialised?",
    options: [
      'Right after super() returns, before the rest of the subclass constructor',
      'Before the parent constructor runs',
      'Lazily, on first access',
      'After the whole constructor finishes',
    ],
    answer: 0,
    why: "In a derived class, fields are defined on `this` right after `super()` returns, before the rest of the subclass constructor body runs. **Not before the parent constructor:** `this` doesn't exist until the parent creates it, which is why a parent calling an overridden method sees the fields as `undefined`. **Not lazily:** fields are eager per instance. **Not after the whole constructor:** code after `super()` can already read them.",
  },
  {
    kind: 'code',
    id: 'deep-equal',
    title: 'Deep equal (with circular refs)',
    difficulty: 'hard',
    prompt: `Return whether two values are deeply equal.

- primitives (\`NaN\` equals \`NaN\`), arrays, plain objects (key order doesn't matter)
- \`Date\`, \`Map\`, \`Set\` (Set members / Map keys may be compared by identity)
- objects with different prototypes (\`[]\` vs \`{}\`) are not equal
- **circular references** must not overflow the stack`,
    ...code('deep-equal'),
  },
];
