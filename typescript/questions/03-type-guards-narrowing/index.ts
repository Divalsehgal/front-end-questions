/**
 * TOPIC: Type Guards & Narrowing
 * Purpose: Differentiating between union types at runtime using safe predicates.
 */

type Admin = {
    name: string;
    privileges: string[];
};

type Employee = {
    name: string;
    startDate: Date;
};

// Intersection type: Combined properties
type ElevatedEmployee = Admin & Employee;

type User = Admin | Employee;

/**
 * 1. Custom Type Guard: `isAdmin`
 * Tells TypeScript that if this returns true, the object is an Admin.
 */
function isAdmin(user: User): user is Admin {
    // We use the 'in' operator as it's the safest way to check properties on objects.
    return 'privileges' in user;
}

/**
 * 2. Type Narrowing Example
 */
function handleUser(user: User) {
    if (isAdmin(user)) {
        // Inside this block, 'user' is narrowed to Admin
        console.log(`Admin ${user.name} has privileges: ${user.privileges.join(", ")}`);
    } else {
        // Here, 'user' must be an Employee
        console.log(`Employee ${user.name} started on: ${user.startDate.toLocaleDateString()}`);
    }
}

// 3. Test Cases
const user1: User = { name: "Dival", privileges: ["Admin Access"] };
const user2: User = { name: "Alice", startDate: new Date() };

handleUser(user1);
handleUser(user2);
