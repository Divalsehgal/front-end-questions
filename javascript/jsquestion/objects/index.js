/**
 * ========================================================
 * OBJECT MUTABILITY CONTROLS
 * Normal vs Object.preventExtensions vs Object.seal vs Object.freeze
 * ========================================================
 * 
 * Under the hood, JavaScript objects rely on Object Property Descriptors
 * to determine what you can and cannot do to them.
 * 
 * The 4 main actions you can perform on an object's properties are:
 * 1. ADD:       Can we add new properties?
 * 2. MODIFY:    Can we change the value of existing properties? (controlled by `writable: true`)
 * 3. DELETE:    Can we delete existing properties? (controlled by `configurable: true`)
 * 4. RE-CONFIG: Can we change descriptor flags like enumerable/writable later? (also `configurable`)
 * 
 * -------------------------------------------------------------------------
 * THE QUICK CHEAT SHEET MATRIX
 * -------------------------------------------------------------------------
 * Action                    | Normal | preventExtensions | seal()  | freeze() |
 * --------------------------|--------|-------------------|---------|----------|
 * ADD new properties        |   ✅   |         ❌         |    ❌   |    ❌    |
 * MODIFY existing values    |   ✅   |         ✅         |    ✅   |    ❌    |
 * DELETE existing properties|   ✅   |         ✅         |    ❌   |    ❌    |
 * RE-CONFIGURE descriptors  |   ✅   |         ✅         |    ❌   |    ❌    |
 * -------------------------------------------------------------------------
 */


// 1. NORMAL OBJECT
// Everything is permissible by default.
const person1 = { name: "John" };
person1.age = 30;     // ✅ ADD works
person1.name = "Doe"; // ✅ MODIFY works
delete person1.age;   // ✅ DELETE works


// 2. Object.preventExtensions(obj)
// Stops new properties from being added. Existing properties remain completely unaffected.
const person2 = { name: "John" };
Object.preventExtensions(person2);
person2.age = 25;     // ❌ ADD fails silently (throws an error in strict mode)
person2.name = "Doe"; // ✅ MODIFY works
delete person2.name;  // ✅ DELETE works


// 3. Object.seal(obj)
// The "Closed Box" - You can change what's inside the box, but you can't put new things in or take things out.
// - Sets `configurable: false` on everything.
const person3 = { name: "John" };
Object.seal(person3);
person3.age = 40;     // ❌ ADD fails
delete person3.name;  // ❌ DELETE fails 
person3.name = "Doe"; // ✅ MODIFY works perfectly! (This is what makes it different from freeze)


// 4. Object.freeze(obj)
// The "Ice Block" - The ultimate lockdown. Nothing can change at all.
// - Sets `configurable: false` AND `writable: false` on everything.
const person4 = { name: "John" };
Object.freeze(person4);
person4.age = 50;     // ❌ ADD fails
delete person4.name;  // ❌ DELETE fails
person4.name = "Doe"; // ❌ MODIFY fails


/**
 * ========================================================
 * INTERVIEW PRO-TIPS:
 * ========================================================
 * 
 * Q: How do you verify what state an object is in?
 * A: JS provides helper checks:
 *    - Object.isExtensible(obj)
 *    - Object.isSealed(obj)
 *    - Object.isFrozen(obj)
 * 
 * Q: Is Object.freeze() completely safe?
 * A: NO! freeze() is SHALLOW. If your object contains a nested object,
 *    the nested object can still be completely modified.
 * 
 *    const obj = Object.freeze({ user: { id: 1 } });
 *    obj.user = { id: 2 }; // ❌ Fails to freeze the main object
 *    obj.user.id = 99;     // ✅ Works! The inner object is NOT frozen.
 *    
 *    To fix this, you must write a custom recursive `deepFreeze()` function.
 */
