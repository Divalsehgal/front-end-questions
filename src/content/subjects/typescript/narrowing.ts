import { codeFiles } from '../../files';
import type { Topic } from '../../types';

const code = codeFiles('typescript', import.meta.glob<string>('./files/*', { query: '?raw', import: 'default', eager: true }));

export const narrowing: Topic = {
  slug: 'narrowing',
  title: 'Narrowing & type guards',
  questions: [
    {
      kind: 'quiz',
      id: 'q-ts-7',
      title: 'Type guards',
      prompt: 'What makes `function isUser(x: unknown): x is User` different from returning `boolean`?',
      options: [
        'When it returns true, TS narrows x to User at the call site',
        'TS checks at runtime that x really is a User',
        'It throws if x is not a User',
        'Nothing; the return type is still boolean',
      ],
      answer: 0,
      why: "A type predicate `x is User` tells the compiler to narrow `x` to `User` in the true branch at the call site; a plain `boolean` return gives no narrowing. **Not a runtime check:** TS trusts your implementation and emits nothing, so a wrong guard silently lies. **Not throws:** it returns true/false; throwing is an assertion function (`asserts x is User`). **Not 'nothing':** the narrowing is the whole point. Validate untrusted data with a schema (zod).",
    },
    {
      kind: 'quiz',
      id: 'ts-q-narrow',
      title: 'Which narrowings work?',
      prompt: "Given `x: string | number | Date | { kind: 'a' } | null`, which checks narrow the type?",
      options: ["`typeof x === 'string'`", '`x instanceof Date`', "`typeof x === 'object' && x !== null && 'kind' in x`", '`x as Date`'],
      answer: [0, 1, 2],
      why: "`typeof x === 'string'`, `x instanceof Date`, and the `typeof ... 'object'` + `!== null` + `'kind' in x` chain are all control-flow narrowings TS understands. **Not x as Date:** an assertion overrides the type for that expression with no runtime check, it never narrows `x` itself.",
    },
    {
      kind: 'code',
      id: 'type-guards',
      title: 'Type guard + exhaustive switch',
      difficulty: 'medium',
      prompt: `1. Write \`isAdmin(user): user is Admin\` so TypeScript narrows in both branches.
2. Write \`area(shape)\` over a discriminated union, made **exhaustive** with \`assertNever\`, so adding a new shape kind becomes a compile error.
3. Type \`assertNever(value: never): never\` so that calling it with anything else won't compile.`,
      ...code('type-guards'),
    },
  ],
};
