/**
 * TOPIC: Generic Constraints
 * Purpose: Understanding how to restrict generic types (e.g., T must be number or string).
 */
function combine<T extends number | string>(a: T, b: T): T {
    // Note: 'as any' is used here because TypeScript cannot guarantee that '+' 
    // works on type T, even though we restricted it to number | string.
    return (a + (b as any)) as T;
}

console.log("Combine Numbers:", combine<number>(2, 3));
console.log("Combine Strings:", combine<string>('dival', 'sehgal'));
