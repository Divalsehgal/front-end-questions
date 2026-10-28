import { codeFiles } from '../../../files';
import type { Question } from '../../../types';

const code = codeFiles('javascript', import.meta.glob<string>('../files/*', { query: '?raw', import: 'default', eager: true }));

export const mutabilityDrillsQuestions: Question[] = [
  {
    kind: 'quiz',
    id: 'ob-q1',
    title: 'Mutability matrix',
    prompt: 'After `Object.seal(obj)`, which operations still work?',
    options: ['Changing the value of an existing property', 'Adding a new property', 'Deleting a property', 'Redefining a property as non-enumerable'],
    answer: 0,
    why: "`Object.seal` makes the object non-extensible and every property non-configurable, but leaves values writable, so changing an existing value still works. **Not adding:** sealed objects are non-extensible. **Not deleting:** non-configurable properties can't be deleted. **Not redefining as non-enumerable:** changing attributes requires configurable. `freeze` additionally makes values non-writable; check with `Object.isSealed`/`isFrozen`.",
  },
  {
    kind: 'quiz',
    id: 'ob-q2',
    title: 'Proxy vs defineProperty',
    prompt: 'Why could Vue 3 detect `obj.newKey = 1` when Vue 2 could not?',
    options: [
      'Vue 3 wraps objects in a Proxy, whose traps see operations on ANY key; Vue 2 used `Object.defineProperty` per existing key',
      'Vue 3 polls objects for changes every frame',
      'Vue 3 uses getters on Object.prototype',
      'Vue 2 froze reactive objects',
    ],
    answer: 0,
    why: "A Proxy's traps (`get`, `set`, `has`, `deleteProperty`) see operations on ANY key of the wrapped object, including keys added later; Vue 2 used `Object.defineProperty` getters/setters per key that existed at setup, so new keys needed `Vue.set`. **Not polling:** Vue never polls. **Not getters on Object.prototype:** that would affect every object and still miss own new keys. **Not freezing:** frozen objects can't be reactive at all.",
  },
  {
    kind: 'quiz',
    id: 'ob-q3',
    title: 'super() in constructors',
    prompt: 'In a subclass constructor, what happens if you use `this` before calling `super()`?',
    options: [
      'ReferenceError: the instance does not exist until the parent constructor creates it',
      'It works, `this` is an empty object',
      'It silently calls super() for you',
      'TypeError only in strict mode',
    ],
    answer: 0,
    why: "In a derived class the parent constructor allocates the object, so until `super()` returns `this` is uninitialized and touching it throws ReferenceError. **Not 'an empty object':** there is no object yet. **Not 'calls super() for you':** only an omitted constructor gets an implicit `super(...args)`. **Not 'TypeError only in strict mode':** class bodies are always strict, and the error is a ReferenceError.",
  },
  {
    kind: 'order',
    id: 'ob-o1',
    title: 'What `new Foo()` does',
    prompt: 'Order the steps JavaScript performs for `new Foo(args)`.',
    items: [
      'Create a brand-new empty object',
      'Link its [[Prototype]] to `Foo.prototype`',
      'Call `Foo` with `this` bound to the new object',
      'Return the new object, unless `Foo` returned an object of its own',
    ],
    why: 'This is why methods put on Foo.prototype are shared, why forgetting `new` puts properties in the wrong place, and why a constructor that returns an object "hijacks" new.',
  },
  {
    kind: 'flashcard',
    id: 'ob-f1',
    title: 'Property descriptors',
    front: 'What are the four flags on a data property, and what does each control?',
    back: `- **value**: the stored value
- **writable**: can the value be changed?
- **enumerable**: does it show up in \`Object.keys\`, \`for...in\`, spread and \`JSON.stringify\`?
- **configurable**: can it be deleted, or its flags changed?

Literal properties default to all \`true\`; \`Object.defineProperty\` defaults missing flags to \`false\`. Accessor properties swap value/writable for **get** / **set**.`,
  },
  {
    kind: 'flashcard',
    id: 'ob-f2',
    title: 'Prototypal inheritance',
    front: 'Explain prototypal inheritance, and the difference between reading and writing a property.',
    back: `Every object has a hidden \`[[Prototype]]\` link. **Reading** a property walks the chain: own object, then its prototype, then up to \`Object.prototype\` → \`null\`. **Writing** always creates/updates an OWN property (it shadows; it never changes the prototype), unless a setter is found up the chain, or the inherited property is read-only (then the write fails, and throws in strict mode).

\`new\` links instances to \`Fn.prototype\`; \`Object.create(proto)\` links directly. Classes are syntax over the same mechanism.`,
  },
  {
    kind: 'code',
    id: 'deep-clone',
    title: 'Deep clone (with cycles)',
    difficulty: 'medium',
    prompt: `Implement \`deepClone\` without \`structuredClone\` or JSON.

- plain objects and arrays are copied recursively
- \`Date\`, \`Map\` and \`Set\` are cloned as their own types
- **circular references** are preserved (the copy points to itself), not infinite
- primitives and functions are returned as-is

Follow-up: what does \`structuredClone\` do differently (functions, class instances)?`,
    ...code('deep-clone'),
  },
  {
    kind: 'code',
    id: 'deep-freeze',
    title: 'deepFreeze',
    difficulty: 'easy',
    prompt:
      '`Object.freeze` is shallow. Write `deepFreeze(obj)` that freezes every nested object and array, returns the same object, and does not loop forever on cycles.',
    ...code('deep-freeze'),
  },
  {
    kind: 'code',
    id: 'type-checks',
    title: 'Type-check helpers',
    difficulty: 'easy',
    prompt: `Implement \`isArray\`, \`isFunction\`, \`isObject\` and \`isPlainObject\`.

- \`isObject\`: objects **and** functions are objects; \`null\` is not (remember \`typeof null\`)
- \`isPlainObject\`: only \`{}\`, \`new Object()\` and \`Object.create(null)\`, not arrays, dates or class instances`,
    ...code('type-checks'),
  },
  {
    kind: 'code',
    id: 'notes-store',
    title: 'NotesStore class',
    difficulty: 'easy',
    prompt: `Build a \`NotesStore\` with \`addNote(state, name)\` and \`getNotes(state)\`.

- valid states: \`completed\`, \`active\`, \`others\`
- \`addNote\` throws \`Error('Name cannot be empty')\` for an empty name
- both methods throw an \`Error\` with message \`Invalid state <state>\` (e.g. \`Invalid state done\`) for unknown states
- \`getNotes\` returns names in insertion order; stores don't share notes`,
    ...code('notes-store'),
  },
];
