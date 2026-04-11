/**
 * TOPIC: Enums & Tuples
 * Purpose: Handling fixed-length arrays and semantic constants.
 */

// 1. Enum: Semantically named constants
enum Role {
    ADMIN = 'admin',
    READ_ONLY = 'read_only',
    AUTHOR = 'author'
}

// 2. Tuple: Fixed-length array with specific types at each position
type UserData = [string, Role, Date];

function printUserData(data: UserData) {
    // Array destructuring is the cleanest way to work with tuples
    const [username, role, createdAt] = data;
    
    console.log("--- User Data ---");
    console.log(`Username: ${username}`);
    console.log(`Role: ${role}`);
    console.log(`Created At: ${createdAt.toLocaleDateString()}`);
}

// 3. Test Cases
const myAdmin: UserData = ["Dival", Role.ADMIN, new Date()];
printUserData(myAdmin);
