# TypeScript Practice Problems Index

This directory contains a structured collection of TypeScript exercises designed to build your skills from basics to advanced patterns.

| Section | Topic | Key Features |
| :--- | :--- | :--- |
| **[fundamentals/primitives](./fundamentals/primitives/index.ts)** | Primitive Types | Base primitive type coverage. |
| **[fundamentals/object](./fundamentals/object/index.ts)** | Object Types | Object type shapes. |
| **[fundamentals/02-object-manipulation](./fundamentals/02-object-manipulation/index.ts)** | Mapped & Utility Types | `keyof`, `Partial<T>`, and Intersection Types (`&`). |
| **[fundamentals/04-enums-and-tuples](./fundamentals/04-enums-and-tuples/index.ts)** | Constants & Fixed Arrays | `enum` roles and fixed-length Tuples. |
| **[fundamentals/08-basics](./fundamentals/08-basics)** | Functions & Utility Types | Optional parameters, built-in utility types. |
| **[advanced-types/01-generics-and-classes](./advanced-types/01-generics-and-classes/index.ts)** | Type Safety | Function generics, Generic Classes (`Stack`), and Tuple returns. |
| **[advanced-types/03-type-guards-narrowing](./advanced-types/03-type-guards-narrowing/index.ts)** | Runtime Safety | Custom type guards (`user is Admin`), `in` operator, and Narrowing. |
| **[advanced-types/05-advanced-conditional-types](./advanced-types/05-advanced-conditional-types/index.ts)** | Type Logic | `infer` keyword, Conditional Types (`T extends U ? X : Y`), and `ReturnType/Parameters`. |
| **[async-and-decorators/06-async-fetching](./async-and-decorators/06-async-fetching/index.ts)** | Async Patterns | Generic `fetch` wrappers and `Promise<T>` handling. |
| **[async-and-decorators/07-decorators](./async-and-decorators/07-decorators/log-method-calls.ts)** | Decorators | Method-call logging decorator. |
| **[react-typescript](./react-typescript/README.md)** | React + TS | Typing event handlers, props, generics, and hooks. |

---

### How to use this directory:
1.  **Read the comments** at the top of each file to understand the topic.
2.  **Examine the implementations** to see the patterns in action.
3.  **Run the code** using `npx ts-node path/to/index.ts` to see the outputs in your terminal.

---

## Quick Recap Notes

1. What is the difference between `any` and `unknown` in TypeScript?

Ans: `any` disables type checking completely. With `unknown`, TypeScript forces you to validate the type before using it.

2. Type vs Interface

Ans: Type and interface are separate constructs. Interface is mainly used for defining object contracts, while type is more flexible and used for unions, intersections, and advanced type compositions.

3. Why Use Generics

Ans: Generics allow us to write reusable and type-safe code by letting us define types dynamically. Instead of using `any`, we use generics to preserve type information while keeping the function or component flexible.

Generics help us write reusable functions while preserving type safety.

```ts
let value: unknown = "hello";

if (typeof value === "string") {
  value.toUpperCase(); // ✅ safe
}

function getFirst(arr: any[]): any {
  return arr[0];
}

function getFirst<T>(arr: T[]): T {
  return arr[0];
}

// input → number[] → output is number
// input → string[] → output is string
```

4. Unknown vs never

Ans: `never` is for cases that never occur - unreachable code or an infinite loop. `unknown` usage forces TS to make you type-check things that are unknown.

```ts
type Action =
  | { type: "add" }
  | { type: "remove" };

function reducer(action: Action) {
  switch (action.type) {
    case "add":
      return;
    case "remove":
      return;
    default:
      const x: never = action; // safety check
  }
}
```

5. Type assertions vs type guards

Ans: A bad assertion silences the compiler but can cause a real runtime error, while type guards catch problems before they happen - an extra layer of safety.

```ts
function combine<T extends string | number>(a: T, b: T): T {
  if (typeof a === "number" && typeof b === "number") {
    return (a + b) as T;
  }
  return `${a}${b}` as T;
}

const r1 = combine(5, 3);           // T = number → returns number ✅
const r2 = combine("hi", "there");  // T = string → returns string ✅
const r3 = combine(5, "hi");
```

6. TypeScript Edge Cases: `keyof any` vs `keyof unknown`

**`type A = keyof any;`**
- **Result**: `string | number | symbol`
- **Why?**: Since `any` can be any object, it can have any valid JS key.
- **Usage**: Use `K extends keyof any` to constrain a generic to any valid object key.

**`type B = keyof unknown;`**
- **Result**: `never`
- **Why?**: `unknown` is type-safe. You can't assume it has any keys until you narrow the type.
- **Comparison**: `any` is "Everything", `unknown` is "Nothing" (until proven otherwise).

| Type | `keyof` Result | Reason |
| :--- | :--- | :--- |
| `any` | `string \| number \| symbol` | Can have any valid JS key. |
| `unknown` | `never` | Cannot assume any keys exist without narrowing. |
| `never` | `string \| number \| symbol` | Vacuously true (Bottom type logic). |

---

> [!TIP]
> **Interview Question**: "How do I restrict a generic `K` to only valid object keys?"
> **Answer**: `K extends keyof any`.
