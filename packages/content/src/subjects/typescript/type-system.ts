import type { Topic } from '../../types';

export const typeSystem: Topic = {
  slug: 'type-system',
  title: 'Type system fundamentals',
  questions: [
    {
      kind: 'quiz',
      id: 'q-ts-1',
      title: 'unknown vs any',
      prompt: 'What can you do with a value of type `unknown` without narrowing it first?',
      options: [
        'Only assign it to unknown/any, or compare it with ===; property access and calls are errors',
        'Anything, like any',
        'Call it, but not read properties',
        'Nothing at all, not even pass it to a function',
      ],
      answer: 0,
      why: "`unknown` is the type-safe top type: anything is assignable TO it, but it is only assignable to `unknown`/`any` and supports equality checks; property access, calls and arithmetic are errors until you narrow (`typeof`, `instanceof`, `in`, a type guard). **Not 'anything, like any':** that is `any`, which switches checking off and leaks. **Not 'call but not read':** calling is also an error. **Not 'nothing at all':** you can still pass it where `unknown` is expected and compare it.",
    },
    {
      kind: 'quiz',
      id: 'q-ts-2',
      title: 'Where never appears',
      prompt: 'In an exhaustive switch over a discriminated union, what is the type of the value in the `default` branch?',
      code: `type Shape = { kind: 'circle'; r: number } | { kind: 'square'; s: number };
function area(s: Shape) {
  switch (s.kind) {
    case 'circle': return Math.PI * s.r ** 2;
    case 'square': return s.s ** 2;
    default: const check = s; // type?
  }
}`,
      options: ['`never`', '`Shape`', '`unknown`', '`{ kind: string }`'],
      answer: 0,
      why: "Each `case` narrows `s` by its `kind`; once both union members are handled nothing is left, so in `default` the type is `never`. Writing `const _exhaustive: never = s` turns 'someone added a kind' into a compile error. **Not Shape:** narrowing has already removed both members. **Not unknown:** narrowing removes types, it never widens to the top type. **Not { kind: string }:** TS doesn't invent a widened shape for unhandled cases.",
    },
    {
      kind: 'quiz',
      id: 'q-ts-3',
      title: 'interface vs type',
      prompt: 'Which can ONLY an interface do?',
      options: [
        'Declaration merging (two declarations with the same name combine)',
        'Describe a union like "a" | "b"',
        'Use mapped or conditional types',
        'Be extended by a class',
      ],
      answer: 0,
      why: "Only interfaces merge: two `interface Window {}` declarations combine, which is how libraries let you augment globals and modules; a duplicate `type` is an error. **Not unions:** only type aliases can be unions. **Not mapped/conditional types:** also type-alias-only. **Not 'extended by a class':** a class can `implements` either an interface or an object-shaped type alias.",
    },
    {
      kind: 'quiz',
      id: 'q-ts-4',
      title: 'Structural typing surprise',
      prompt: 'Does this compile?',
      code: `type User = { name: string };
const raw = { name: 'Ann', password: 'x' };
const u: User = raw;              // (1)
const v: User = { name: 'Bo', password: 'y' }; // (2)`,
      options: ['(1) compiles, (2) errors (excess property check on fresh object literals)', 'Both compile', 'Both error', '(1) errors, (2) compiles'],
      answer: 0,
      why: 'TS is structural, so `raw` (which has at least `name: string`) is a valid `User` in (1); excess property checks run only on fresh object literals written directly at the assignment, so `password` errors in (2). **Not both compile:** misses the excess property check. **Not both error:** extra properties on a non-literal are fine. **Not (1) errors, (2) compiles:** exactly backwards.',
    },
    {
      kind: 'quiz',
      id: 'q-ts-10',
      title: 'Enums vs unions',
      prompt: 'Why do many teams prefer `type Status = "idle" | "loading"` (or an `as const` object) over `enum Status`?',
      options: [
        'Unions are erased at compile time (zero runtime code) and work with plain strings; enums emit runtime objects, and numeric enums still accept any `number`-typed value',
        'Enums are deprecated in TypeScript 5',
        'Unions are faster at runtime',
        'Enums cannot be used in switch statements',
      ],
      answer: 0,
      why: "A string-literal union is erased at compile time (zero runtime code) and accepts plain strings, while an `enum` emits a runtime object, doesn't work with erasable-only type stripping (Node's built-in stripping, `--erasableSyntaxOnly`), and numeric enums accept any `number`. **Not deprecated:** enums are still supported. **Not faster at runtime:** both compare strings or numbers; the difference is emitted code. **Not 'can't use in switch':** enums switch fine. A const object plus `typeof obj[keyof typeof obj]` gives a value and a type.",
    },
    {
      kind: 'output',
      id: 'ts-o1',
      title: 'numeric enums have a reverse mapping',
      lang: 'ts',
      code: `enum Direction { Up = 1, Down, Left, Right }
enum Role { Admin = 'admin', Reader = 'read_only' }
console.log(Direction.Down, Direction[2], Direction[4]);
console.log(Object.keys(Direction));
console.log(Role.Admin, (Role as any)['admin']);`,
      why: 'Numeric enums auto-increment from the first value AND compile to an object with a reverse mapping (value → name), which is why Object.keys shows the numbers too. String enums have no reverse mapping. Enums are one of the few TS features that emit runtime code.',
    },
    {
      kind: 'output',
      id: 'ts-o2',
      title: 'type assertions do nothing at runtime',
      lang: 'ts',
      code: `type User = { name: string; age: number };
const data: unknown = JSON.parse('{"name":"Ann"}');
const user = data as User;
console.log(user.age.toFixed(0));`,
      why: 'Types are erased: `as User` is a promise to the compiler, not a check. age is missing at runtime, so .toFixed throws TypeError. Use a type guard or a schema validator (zod) for data from the network.',
    },
    {
      kind: 'output',
      id: 'ts-o3',
      title: 'optional vs default parameters',
      lang: 'ts',
      code: `function sum(numbers: number[], divisor?: number) {
  const total = numbers.reduce((a, b) => a + b, 0);
  return divisor ? total / divisor : total;
}
function greet(name = 'stranger') {
  return 'hi ' + name;
}
console.log(sum([1, 2, 3]), sum([10, 20], 2), sum([10, 20], 0));
console.log(greet(), greet(undefined), greet(null as any));`,
      why: 'An optional parameter is just undefined when omitted. Checking `if (divisor)` also treats 0 as missing (often a bug; prefer `divisor !== undefined`). Defaults apply only for undefined, never for null.',
    },
    {
      kind: 'flashcard',
      id: 'ts-f1',
      title: 'any vs unknown vs never',
      front: 'Explain `any`, `unknown` and `never` in one sentence each, with where each appears.',
      back: `- **any**: turns type checking off for that value and everything it touches. An escape hatch.
- **unknown**: the safe top type. Anything can be assigned to it, but you must **narrow** it (typeof / instanceof / a guard) before using it. Right for \`JSON.parse\` results and \`catch (e)\`.
- **never**: the empty type, for values that can't exist. It's the return type of functions that always throw or never return, and what's left after an exhaustive switch.

Edge case: \`keyof any\` is \`string | number | symbol\`, but \`keyof unknown\` is \`never\`.`,
    },
    {
      kind: 'flashcard',
      id: 'ts-f2',
      title: 'Assertions vs guards',
      front: 'What is the difference between a type assertion (`as`) and a type guard?',
      back: `An **assertion** tells the compiler "trust me" and emits no runtime code. If you're wrong, it fails later at runtime with a confusing error.

A **guard** is real runtime code (\`typeof\`, \`instanceof\`, \`in\`, or a \`x is T\` predicate function) that the compiler also understands, so the narrowed type is actually true.

Prefer guards (or schema validation) at trust boundaries, and assertions only when you know more than the compiler (e.g. \`document.getElementById('root')!\`).`,
    },
    {
      kind: 'flashcard',
      id: 'ts-f3',
      title: 'Why generics',
      front: 'Why use generics instead of `any`? Give a one-line example.',
      back: `Generics keep the **relationship** between input and output types while staying reusable. \`any\` throws that information away.

\`function first<T>(arr: T[]): T\`: pass \`number[]\`, get \`number\` back; pass \`string[]\`, get \`string\`. With \`any[] → any\`, every caller loses autocomplete and type checking.

Add **constraints** (\`<T extends { id: string }>\`) when the function needs to use something about T.`,
    },
  ],
};
