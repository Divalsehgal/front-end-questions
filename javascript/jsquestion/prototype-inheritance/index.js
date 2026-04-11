/**
 * PROTOTYPAL INHERITANCE GUIDE
 * 
 * Concept: Objects have a hidden [[Prototype]] property that points to another object.
 */

// 1. THE BASIC LINK (__proto__)
const animal = {
    eats: true,
    walk() {
        console.log("Animal walks");
    }
};

const rabbit = {
    jumps: true,
    __proto__: animal // rabbit inherits from animal
};

console.log("--- Basic Prototype Chain ---");
console.log("Rabbit eats:", rabbit.eats); // true (from animal)
rabbit.walk(); // "Animal walks" (from animal)


// 2. WRITING DOES NOT USE PROTOTYPE
// Properties are always added to the object itself, not the prototype.
rabbit.walk = function() {
    console.log("Rabbit hops!");
};
rabbit.walk();   // "Rabbit hops!" (own property)
animal.walk();   // "Animal walks" (unchanged)


// 3. THE MODERN WAY: Object.create()
const vehicle = {
    wheels: 4,
    drive() { console.log("Vroom!"); }
};

const car = Object.create(vehicle, {
    brand: { value: "Tesla" }
});

console.log("\n--- Object.create ---");
console.log(car.brand); // Own property
car.drive();      // Inherited property


// 4. FUNCTION PROTOTYPES (Classic Class Pattern)
function User(name) {
    this.name = name;
}
// Methods added to .prototype are shared via the chain
User.prototype.sayHi = function() {
    console.log(`Hi, I'm ${this.name}`);
};

const john = new User("John");
john.sayHi();


// ===========================================================================
// INTERVIEW Q&A SUMMARY:
// ===========================================================================
/*
Q: What is prototypal inheritance?
A: It's a mechanism where objects inherit features from one another. Every object 
   has a secret link to another object (its prototype). When searching for a 
   property, JS traverses this "Prototype Chain" until it hit null.

Q: How does it differ from Class inheritance?
A: Class inheritance is like a "blueprint" (copying structure), whereas 
   Prototypal inheritance is a "live link" (delegation).

Q: Usage in Frameworks?
A: 
- React: Component methods (setState) live on React.Component.prototype.
- Node: All streams/servers inherit EventEmitter.prototype.
- Vue: Plugin installation often works by augmenting Vue.prototype.
*/
