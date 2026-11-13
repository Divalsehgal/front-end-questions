import type { Topic } from '../../types';

export const coercion: Topic = {
  slug: 'coercion',
  title: 'Coercion & equality',
  questions: [
    {
      kind: 'output',
      id: 'co-1',
      title: '+, ==, null comparisons, Object.is',
      code: 'console.log([] + {}, [] == ![], null == 0, null >= 0, NaN === NaN, Object.is(-0, 0), [1, 2] + [3]);',
      why: '"+ with an object → strings": [] → "", {} → "[object Object]". "== with a boolean → numbers": ![] is false, so [] == false → "" == 0 → 0 == 0. "null only equals undefined" under ==, but relational ops DO convert null → 0. NaN never equals itself. Object.is tells -0 from 0. Arrays stringify via join(",") → "1,2" + "3".',
    },
    {
      kind: 'output',
      id: 'co-2',
      title: 'arithmetic with strings, null, undefined',
      code: "console.log(1 + '2', '3' - 1, '3' * '4', true + 1, null + 1, undefined + 1, +'', +' 12 ', +'1a');",
      why: 'If either side of + is a string, it concatenates. Every other arithmetic operator converts to numbers. null → 0, undefined → NaN, "" → 0, unary + trims whitespace, but any junk ("1a") → NaN.',
    },
    {
      kind: 'output',
      id: 'co-3',
      title: 'loose equality table',
      code: "console.log(0 == '', 0 == '0', '' == '0', false == 'false', false == '0', undefined == null, undefined == 0);",
      why: 'string vs number → string becomes a number. boolean → number first. "" vs "0" are two strings, compared as-is (no conversion). "false" → NaN. null/undefined only equal each other.',
    },
    {
      kind: 'output',
      id: 'co-4',
      title: 'truthy or falsy?',
      code: "console.log(!!'0', !!'', !![], !!{}, !!NaN, !!-0, !!0n, Boolean(new Boolean(false)));",
      why: 'The 8 falsy values: false, 0, -0, 0n, "", null, undefined, NaN. Everything else is truthy, including "0", [], {} and the object new Boolean(false).',
    },
    {
      kind: 'output',
      id: 'co-5',
      title: 'sort, parseInt, floats',
      code: "console.log([10, 9, 1, 2].sort(), parseInt(0.0000005), ['1', '2', '3'].map(parseInt), 0.1 + 0.2 === 0.3);",
      why: 'Default sort compares as STRINGS → [1, 10, 2, 9]; use (a, b) => a - b. parseInt stringifies first: 0.0000005 → "5e-7" → 5. map passes (value, index): parseInt("2", 1) and parseInt("3", 2) are NaN. 0.1 + 0.2 is 0.30000000000000004.',
    },
    {
      kind: 'output',
      id: 'co-6',
      title: 'valueOf vs toString',
      code: `const money = {
  valueOf() {
    return 42;
  },
  toString() {
    return '$42';
  },
};
console.log(money + 1, \`\${money}\`, money * 2, String(money), money == 42);`,
      why: 'Hint "default" (+, ==) and "number" (*) call valueOf first. Hint "string" (template literals, String()) calls toString first. Symbol.toPrimitive overrides both.',
    },
    {
      kind: 'output',
      id: 'co-7',
      title: 'typeof quirks',
      code: 'console.log(typeof null, typeof [], typeof NaN, typeof function () {}, typeof class {}, typeof typeof 1);',
      why: 'typeof null is "object" (a historic bug). Arrays are objects; use Array.isArray. NaN is a number. Classes are functions. typeof always returns a string.',
    },
  ],
};
