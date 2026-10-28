import { codeFiles } from '../../files';
import type { Topic } from '../../types';

const code = codeFiles('typescript', import.meta.glob<string>('./files/*', { query: '?raw', import: 'default', eager: true }));

export const genericsUtility: Topic = {
  slug: 'generics-utility',
  title: 'Generics & utility types',
  questions: [
    {
      kind: 'quiz',
      id: 'q-ts-5',
      title: 'Distributive conditional types',
      prompt: '`type ToArray<T> = T extends any ? T[] : never` What is `ToArray<string | number>`?',
      options: ['`string[] | number[]`', '`(string | number)[]`', '`never`', '`any[]`'],
      answer: 0,
      why: 'A conditional type on a naked type parameter distributes over a union: `ToArray<string | number>` becomes `ToArray<string> | ToArray<number>` = `string[] | number[]`. **Not (string | number)[]:** that is what you get when you stop distribution with `[T] extends [any]`. **Not never:** both members satisfy `extends any`. **Not any[]:** `T` keeps its real type.',
    },
    {
      kind: 'quiz',
      id: 'q-ts-6',
      title: 'satisfies',
      prompt: 'What does `satisfies` give you over a type annotation?',
      code: "const routes = { home: '/', user: '/user/:id' } satisfies Record<string, string>;",
      options: [
        'It checks the value against the type but keeps the narrower inferred type (routes.home is still known as a key)',
        'It casts the value like `as`',
        'It makes the object readonly',
        'Nothing; it is an alias for `:`',
      ],
      answer: 0,
      why: "`satisfies` checks the value against the type but keeps the narrower inferred type, so `routes.home` is still a known key and `routes.nope` is an error. **Not 'casts like as':** `as` skips the check, `satisfies` enforces it. **Not readonly:** that is `as const` or `Readonly<>`. **Not an alias for ':':** an annotation widens to `Record<string, string>`, losing the literal keys.",
    },
    {
      kind: 'quiz',
      id: 'q-ts-8',
      title: 'Utility types',
      prompt: 'Which gives the type of the value a Promise-returning function resolves to?',
      code: "async function getUser() { return { id: 1, name: 'Ann' }; }",
      options: ['`Awaited<ReturnType<typeof getUser>>`', '`ReturnType<typeof getUser>`', '`Parameters<typeof getUser>`', '`InstanceType<typeof getUser>`'],
      answer: 0,
      why: '`ReturnType<typeof getUser>` is `Promise<{ id: number; name: string }>`, and `Awaited<>` unwraps the promise (recursively) to the resolved value. **Not ReturnType alone:** still wrapped in `Promise`. **Not Parameters:** gives the arguments tuple (`[]` here). **Not InstanceType:** only works on constructor types.',
    },
    {
      kind: 'quiz',
      id: 'q-ts-9',
      title: 'Generic constraints',
      prompt: 'Why does this error, and what is the fix?',
      code: `function getProp<T>(obj: T, key: string) {
  return obj[key]; // error
}`,
      options: [
        '`key` could be any string; use `<T, K extends keyof T>(obj: T, key: K): T[K]`',
        'Generics cannot index objects; use any',
        'obj must be declared as object',
        'You must use obj.key instead',
      ],
      answer: 0,
      why: "`key: string` could be any string, so `obj[key]` is not known to exist on `T`; constraining `K extends keyof T` makes the access safe and gives a precise `T[K]` return type. **Not 'use any':** generics can index objects once constrained, and `any` discards safety. **Not 'declare as object':** `object` has no known keys either. **Not obj.key:** that reads a literal property named `key`.",
    },
    {
      kind: 'code',
      id: 'object-helpers',
      title: 'Typed getProperty, update and pair',
      difficulty: 'easy',
      prompt: `Make these correct at runtime **and** precisely typed, with no \`any\` in the signatures:

- \`getProperty(obj, key)\`: the key must exist on obj, and the return type is that property's type (\`T[K]\`)
- \`update(original, changes)\`: changes can only contain known keys with the right types (\`Partial<T>\`)
- \`pair(a, b)\`: returns a typed tuple \`[A, B]\``,
      ...code('object-helpers'),
    },
    {
      kind: 'code',
      id: 'typed-stack',
      title: 'Generic Stack class',
      difficulty: 'easy',
      prompt:
        'Build `Stack<T>` with `push`, `pop` and `peek` (both `T | undefined`), a `size` getter and `isEmpty()`. Keep the storage truly private (`#field`), and make `push` only accept `T`.',
      ...code('typed-stack'),
    },
    {
      kind: 'code',
      id: 'typed-fetch',
      title: 'Typed fetch wrapper',
      difficulty: 'easy',
      prompt:
        'Write `fetchJson<T>(url, init?)`, which returns `Promise<T>`, throws on a non-OK status (fetch only rejects on network errors) and passes `init` through. Then explain why the generic is a promise to the compiler, not a runtime check.',
      ...code('typed-fetch'),
    },
    {
      kind: 'code',
      id: 'my-pick',
      title: 'Type challenge: MyPick',
      difficulty: 'easy',
      prompt:
        "Implement `MyPick<T, K>` like the built-in `Pick`, without using it. Keys that aren't on `T` must be a compile error. **Check types** is the test.",
      ...code('my-pick'),
    },
    {
      kind: 'code',
      id: 'my-omit',
      title: 'Type challenge: MyOmit',
      difficulty: 'medium',
      prompt:
        'Implement `MyOmit<T, K>` without `Omit`, `Pick` or `Exclude`. Hint: key remapping in a mapped type (`as`), where mapping a key to `never` drops it.',
      ...code('my-omit'),
    },
    {
      kind: 'code',
      id: 'my-readonly',
      title: 'Type challenge: Readonly and DeepReadonly',
      difficulty: 'medium',
      prompt:
        'Implement `MyReadonly<T>`, then `DeepReadonly<T>` that makes nested objects and arrays readonly too, while leaving functions callable and primitives unchanged.',
      ...code('my-readonly'),
    },
    {
      kind: 'code',
      id: 'my-utilities',
      title: 'Type challenge: Partial, Required, Exclude, Extract',
      difficulty: 'medium',
      prompt:
        'Re-implement `Partial`, `Required` (hint: the `-?` modifier), `Exclude` and `Extract` (hint: conditional types distribute over unions), then `PartialBy<T, K>`, which makes only the keys `K` optional.',
      ...code('my-utilities'),
    },
    {
      kind: 'code',
      id: 'infer-types',
      title: 'Type challenge: infer',
      difficulty: 'hard',
      prompt:
        'Use `infer` to build `Flatten<T>` (one level of array), `MyReturnType`, `MyParameters`, and a recursive `MyAwaited` that unwraps nested promises.',
      ...code('infer-types'),
    },
    {
      kind: 'code',
      id: 'tuple-types',
      title: 'Type challenge: tuples',
      difficulty: 'medium',
      prompt: 'Implement `TupleToUnion`, `TupleToObject` (for `as const` arrays), `Last` (hint: variadic tuple + infer), and `Length`.',
      ...code('tuple-types'),
    },
  ],
};
