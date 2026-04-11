/**
 * JAVASCRIPT PROPERTY DESCRIPTORS & FLAGS
 * 
 * In JS, properties aren't just value holders. They have 4 attributes (flags):
 * 1. value        - The actual property value.
 * 2. writable     - If true, value can be changed.
 * 3. enumerable   - If true, shows up in loops and Object.keys().
 * 4. configurable - If true, property can be deleted and flags modified.
 */

// 1. VIEWING DESCRIPTORS
const user = { name: "John" };
const descriptor = Object.getOwnPropertyDescriptor(user, 'name');

console.log("--- Default Flags ---");
console.log(descriptor);


// 2. MAKING A PROPERTY READ-ONLY (WRITABLE: FALSE)
const readonlyUser = {};
Object.defineProperty(readonlyUser, "id", {
    value: 101,
    writable: false,      // Cannot change value
    enumerable: true,
    configurable: true
});

console.log("\n--- Read-Only Example ---");
console.log("Initial ID:", readonlyUser.id);
readonlyUser.id = 999;     // This fails silently (or throws error in strict mode)
console.log("After update attempt:", readonlyUser.id); // Still 101


// 3. HIDING A PROPERTY FROM LOOPS (ENUMERABLE: FALSE)
const hiddenUser = { name: "Alice", age: 30 };
Object.defineProperty(hiddenUser, "secret", {
    value: "123456",
    enumerable: false      // Hidden from enumeration
});

console.log("\n--- Non-Enumerable Example ---");
console.log("Keys found in loop:");
for (let key in hiddenUser) {
    console.log("-", key); // Only name and age show up
}
console.log("Direct access still works:", hiddenUser.secret);


// 4. PREVENTING DELETION (CONFIGURABLE: FALSE)
const constantObj = {};
Object.defineProperty(constantObj, "PI", {
    value: 3.14,
    writable: false,
    configurable: false,   // Cannot be deleted or flags changed
    enumerable: true
});

console.log("\n--- Non-Configurable Example ---");
delete constantObj.PI;     // Fails
console.log("Value after delete attempt:", constantObj.PI); // Still 3.14

// Trying to change flags also fails:
// Object.defineProperty(constantObj, "PI", { writable: true }); // Error!


// 5. DEFINING MULTIPLE AT ONCE
const multiObj = {};
Object.defineProperties(multiObj, {
    prop1: { value: "A", writable: true },
    prop2: { value: "B", writable: false }
});

console.log("\n--- Multi-Property Define ---");
console.log(multiObj);


// ===========================================================================
// GLOBAL OBJECT METHODS (Flags at Scale)
// ===========================================================================

// 6. OBJECT.SEAL(obj)
// Internally: Sets all properties to configurable: false
const sealedBag = { item: "Phone" };

console.log("\n--- Object.seal Internal Details ---");
Object.seal(sealedBag);

// Checking the flags after sealing
console.log("Flags after seal:", Object.getOwnPropertyDescriptor(sealedBag, 'item'));
/* Result: writable: true, configurable: false */

sealedBag.item = "Laptop"; // WORKS (it's still writable)
delete sealedBag.item;     // FAILS (it's not configurable)
sealedBag.newKey = 1;      // FAILS (object is non-extensible)
console.log("Sealed Object state:", sealedBag);


// 7. OBJECT.FREEZE(obj)
// Internally: Sets all properties to configurable: false AND writable: false
const frozenIce = { temp: 0 };

console.log("\n--- Object.freeze Internal Details ---");
Object.freeze(frozenIce);

// Checking the flags after freezing
console.log("Flags after freeze:", Object.getOwnPropertyDescriptor(frozenIce, 'temp'));
/* Result: writable: false, configurable: false */

frozenIce.temp = 32;       // FAILS (it's not writable)
delete frozenIce.temp;     // FAILS (it's not configurable)
console.log("Frozen Object state:", frozenIce);


/**
 * SUMMARY CHART:
 * Method            | Add New? | Delete? | Change? | Internal Flag Change
 * ------------------|----------|---------|---------|-----------------------
 * preventExtensions | No       | Yes     | Yes     | [[Extensible]] = false
 * seal              | No       | No      | Yes     | configurable = false
 * freeze            | No       | No      | No      | configurable = false, writable = false
 */
