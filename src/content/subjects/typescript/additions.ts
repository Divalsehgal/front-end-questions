import type { Question } from '../../types';

// Extra questions for EXISTING TypeScript topics, keyed by topic slug: spread into that topic's questions.
export const additions: Record<'type-system' | 'generics-utility', Question[]> = {
  'type-system': [
    {
      kind: 'quiz',
      id: 'tsr-a1',
      title: 'Conflicting intersections',
      difficulty: 'hard',
      prompt: 'What do `A` and `B` reduce to?',
      code: `type A = { id: string } & { id: number };
type B = { kind: 'a'; x: number } & { kind: 'b' };`,
      options: [
        '`A` stays an object type whose `id` is `never`; `B` reduces to `never` entirely',
        'Both become `never`',
        "`A['id']` is `string | number`; `B['kind']` is `'a' | 'b'`",
        'Both are compile errors at the declaration',
      ],
      answer: 0,
      why: "An intersection intersects the types of shared properties, so `A['id']` is `string & number` = `never` (no value of `A` can exist, but the type itself is kept); when the clashing property is a literal-typed discriminant, TS 3.9+ reduces the whole object type to `never`, as with `B`. **Not 'both become never':** only discriminant clashes collapse the whole type. **Not string | number:** that would be a union, not an intersection. **Not compile errors:** conflicting intersections are legal; they just can't be inhabited.",
    },
    {
      kind: 'quiz',
      id: 'tsr-a2',
      title: 'What T extends {} allows',
      difficulty: 'medium',
      prompt: 'A generic `List<T extends {}>` component constrains its items. Which values satisfy `{}`?',
      options: ["`0` and `''`", '`{ id: 1 }`', '`null`', '`undefined`'],
      answer: [0, 1],
      why: "`{}` means 'any value that isn't `null` or `undefined`', so primitives like `0` and `''` satisfy it just like objects do; it is the standard way to say 'non-nullish', and `NonNullable<T>` is defined as `T & {}`. **Not null:** under `strictNullChecks` `null` is excluded. **Not undefined:** likewise excluded. Use `object` if you really mean non-primitive, or `Record<string, unknown>` for a plain object.",
    },
  ],
  'generics-utility': [
    {
      kind: 'quiz',
      id: 'tsr-a3',
      title: 'Literal inference through an identity generic',
      difficulty: 'medium',
      prompt: 'What are the types of `a`, `b` and `c`?',
      code: `function identity<T>(value: T): T { return value; }
const a = identity('hello');
let b = identity('hello');
const c = identity<string>('hello');`,
      options: ["`a: 'hello'`, `b: string`, `c: string`", 'All three are `string`', "All three are `'hello'`", "`a: 'hello'`, `b: 'hello'`, `c: string`"],
      answer: 0,
      why: "`T` is inferred as the literal `'hello'` (it appears at the top level of the return type, so TS keeps the literal), giving `a: 'hello'`; `let` widens that widening literal to `string` so `b` can be reassigned; an explicit `<string>` skips inference entirely. **Not 'all string':** inference keeps literal types here. **Not 'all hello':** `let` widens and the explicit argument wins. **Not b: 'hello':** a mutable `let` binding widens fresh literal types.",
    },
  ],
};
