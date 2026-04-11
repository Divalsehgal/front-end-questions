/**
 * TOPIC: Advanced Conditional Types
 * Purpose: Understanding `infer`, recursion, and function transformations.
 */

/**
 * 1. Conditional Type: `Flatten`
 * If T is an array, it returns the element type; otherwise, it returns T.
 * 
 * Logic: 
 * - T extends Array<infer Item> : "If T is an array, capture its element type as 'Item'"
 * - ? Item : "Then the result is 'Item'"
 * - : T    : "Otherwise, the result is the original type T"
 */
type Flatten<T> = T extends Array<infer Item> ? Item : T;

// Examples:
type A = Flatten<number[]>;    // number
type B = Flatten<string>;      // string
type C = Flatten<boolean[][]>; // boolean[]

function flattenArray<T extends any[]>(arr: T): Flatten<T>[] {
    return arr.flat() as Flatten<T>[];
}

/**
 * 2. Function Transformation: `memoize`
 * Wraps a function and caches results using `Parameters` and `ReturnType`.
 */
function memoize<T extends (...args: any[]) => any>(fn: T): T {
    const cache = new Map<string, ReturnType<T>>();
    
    return function (...args: Parameters<T>): ReturnType<T> {
        const key = args.join('-');

        if (cache.has(key)) {
            console.log("Fetching from cache for:", key);
            return cache.get(key)!;
        }
        
        const res = fn(...args);
        cache.set(key, res);
        return res;
    } as T;
}

const slowAdd = (a: number, b: number) => a + b;
const fastAdd = memoize(slowAdd);

console.log(fastAdd(1, 2)); // Computed
console.log(fastAdd(1, 2)); // From cache
