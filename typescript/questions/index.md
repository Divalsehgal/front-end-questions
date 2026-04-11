
1. What is the difference between any and unknown in TypeScript?

Ans : any disables type checking completely, “With unknown, TypeScript forces you to validate the type before using it.”

2. Type vs Interface 

Ans: Type and interface are separate constructs. Interface is mainly used for defining object contracts, while type is more flexible and used for unions, intersections, and advanced type compositions.”

3. Why Use Generics

Ans: Generics allow us to write reusable and type-safe code by letting us define types dynamically. Instead of using any, we use generics to preserve type information while keeping the function or component flexible.

Generics help us write reusable functions while preserving type safety.

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

input → number[] → output is number
input → string[] → output is string


4. Unknown vs never

Ans: Never which cases never occurs unreacheble code or infinite loop 
Unkown usage forces ts to use some type check things are unknown

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

5.
A bad assertion silences the compiler but can cause real run time error while type guards catch problems before they hapens Extra layer 


function combine<T extends string | number>(a: T, b: T): T {
  if (typeof a === "number" && typeof b === "number") {
    return (a + b) as T;
  }
  return `${a}${b}` as T;
}

const r1 = combine(5, 3);           // T = number → returns number ✅
const r2 = combine("hi", "there");  // T = string → returns string ✅
const r3 = combine(5, "hi");  

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