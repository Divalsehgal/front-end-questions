/**
 * TYPESCRIPT UTILITY TYPES GUIDE
 * This file explores common utility types using Conditional and Mapped types.
 */

// ===========================================================================
// SECTION 1: CONDITIONAL TYPES (Testing types with 'extends ? :')
// ===========================================================================

/** Checks if T is a string */
type IsString<T> = T extends string ? true : false;

/** Excludes types from T that are assignable to U */
type MyExclude<T, U> = T extends U ? never : T;


// ===========================================================================
// SECTION 2: MAPPED TYPES (Transforming object properties)
// ===========================================================================

/** Makes all properties in T optional (Equivalent to Partial<T>) */
type Optional<T> = {
    [P in keyof T]?: T[P]
}

/** Makes all properties in T readonly (Equivalent to Readonly<T>) */
type MyReadonly<T> = {
    readonly [P in keyof T]: T[P]
}


// ===========================================================================
// SECTION 3: UNIFIED UTILITY TYPES (Combining mechanisms)
// ===========================================================================

/** Picks only specific keys K from type T (Equivalent to Pick<T, K>) */
type MyPick<T, K extends keyof T> = {
    [P in K]: T[P]
}

/** Omits specific keys K from type T (Equivalent to Omit<T, K>) */
type MyOmit<T, K extends keyof any> = MyPick<T, MyExclude<keyof T, K>>;


// ===========================================================================
// SECTION 4: TEST ENVIRONMENT & EXAMPLES
// ===========================================================================

interface User {
    id: number;
    name: string;
}

interface Person {
    name: string;
    age: number;
    email: string;
}

// 1. Conditional Tests
const isNameString: IsString<string> = true;
const isAgeString: IsString<number> = false;

// 2. Mapped Tests (Optional)
const partialUser: Optional<User> = { name: "Alice" };

// 3. Mapped Tests (Readonly)
const lockedPerson: MyReadonly<Person> = {
    name: "Locked",
    age: 25,
    email: "locked@example.com"
};
// lockedPerson.name = "New Name"; // Error: Cannot assign to 'name' because it is a read-only property.

// 4. Combined Tests (Pick & Omit)
const onlyName: MyPick<Person, "name"> = { name: "Picky" };
const noEmail: MyOmit<Person, "email"> = { name: "Omitted", age: 40 };

console.log("--- TypeScript Practice Results ---");
console.log("Is Name String (string):", isNameString);
console.log("Is Age String (number):", isAgeString);
console.log("Partial User:", partialUser);
console.log("Readonly Person:", lockedPerson);
console.log("Picked Name:", onlyName);
console.log("Omitted Email:", noEmail);