/**
 * JAVASCRIPT ACCESSOR DESCRIPTORS (GETTERS & SETTERS)
 * 
 * Accessor properties don't store a value themselves. Instead, they provide 
 * functions to get and set a value.
 */

// 1. BASIC LITERAL SYNTAX
const user = {
    firstName: "John",
    lastName: "Doe",

    // GETTER: Executed when reading 'fullName'
    get fullName() {
        return `${this.firstName} ${this.lastName}`;
    },

    // SETTER: Executed when assigning to 'fullName'
    set fullName(value) {
        const parts = value.split(" ");
        this.firstName = parts[0] || "";
        this.lastName = parts[1] || "";
    }
};

console.log("--- Basic Getter/Setter ---");
console.log("Initial FullName:", user.fullName); // John Doe

user.fullName = "Alice Wonderland";
console.log("Updated FirstName:", user.firstName); // Alice
console.log("Updated FullName:", user.fullName);   // Alice Wonderland


// 2. MODERN USAGE: VALIDATION & DATA NORMALIZATION
const account = {
    _balance: 0, // Internal state

    get balance() {
        return `$${this._balance.toFixed(2)}`;
    },

    set balance(value) {
        if (typeof value !== 'number' || value < 0) {
            console.error("Invalid balance amount!");
            return;
        }
        this._balance = value;
    }
};

console.log("\n--- Validation Example ---");
account.balance = 100;
console.log("Formatted Balance:", account.balance); // $100.00
account.balance = -50; // Triggers error check


// 3. DEFINE VIA Object.defineProperty
// Used when you want to add accessors to existing objects or control flags
const circle = { radius: 10 };

Object.defineProperty(circle, "area", {
    get() {
        return Math.PI * (this.radius ** 2);
    },
    // No setter means it's Read-Only
    enumerable: true,
    configurable: true
});

console.log("\n--- defineProperty Accessor ---");
console.log("Radius:", circle.radius);
console.log("Area (Computed):", circle.area.toFixed(2));
circle.area = 500; // Does nothing (no setter defined)


// 4. USE CASE: WRAPPING LEGACY DATA
// Imagine you used to store 'name', but now you use 'firstName' and 'lastName'
function LegacyUser(name) {
    this.name = name; // Old way
}

const obj = new LegacyUser("Old Name");

// We can "migrate" while keeping the old 'name' property working
Object.defineProperty(obj, "name", {
    get() {
        return this._name;
    },
    set(v) {
        console.log("Logging change to name...");
        this._name = v;
    }
});

console.log("\n--- Legacy Wrapper ---");
obj.name = "New Way";
