/**
 * TOPIC: Object Manipulation
 * Purpose: Using `keyof`, `Partial`, and Intersection types.
 */

// 1. Safe Property Access: `getProperty`
// Uses `K extends keyof T` to ensure the key exists on the object.
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
    return obj[key];
}

const user = { name: "Alice", age: 30, email: "alice@example.com" };
console.log("Name:", getProperty(user, "name")); // ✅ "Alice"
console.log("Age:", getProperty(user, "age"));   // ✅ 30

// 2. Object Merging: `merge`
// Combines two objects and returns an intersection type T & U.
function merge<T, U>(a: T, b: U): T & U {
    return { ...a, ...b };
}

const person = { name: "Bob" };
const details = { age: 25, city: "NYC" };
const combined = merge(person, details);
console.log("Merged:", combined);

// 3. Partial Updates: `update`
// Uses `Partial<T>` to allow passing only a subset of fields.
function update<T>(original: T, changes: Partial<T>): T {
    return { ...original, ...changes };
}

type User = { name: string; age: number; email: string };
const baseUser: User = { name: "Carol", age: 28, email: "c@x.com" };
const updatedUser = update(baseUser, { age: 29 });
console.log("Updated User:", updatedUser);

// 4. Pick vs Omit for Type Safety
// Problem: User type contains sensitive data we don't want to expose.
interface UserFull {
    id: number;
    name: string;
    email: string;
    password: string; // ❌ Sensitive - should not be exposed
    createdAt: Date;  // ❌ Internal - may not need to expose
}

// Solution 1: Pick - Select only the fields you need
type UserSummary = Pick<UserFull, "id" | "name" | "email">;
// Result: { id: number; name: string; email: string }

// Solution 2: Omit - Exclude sensitive/unnecessary fields
type UserPublic = Omit<UserFull, "password" | "createdAt">;
// Result: { id: number; name: string; email: string }

// Function implementation
function getUserSummary(user: UserFull): UserSummary {
    return {
        id: user.id,
        name: user.name,
        email: user.email
    };
}

const fullUser: UserFull = {
    id: 1,
    name: "Alice",
    email: "alice@example.com",
    password: "secret123",
    createdAt: new Date()
};

const summary: UserSummary = getUserSummary(fullUser);
console.log("User Summary:", summary); // Only safe fields exposed
