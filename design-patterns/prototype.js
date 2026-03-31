/*

Prototype pattern means creating a new object using another object as a base (blueprint).
The new object can reuse properties and methods from the original object.
In JavaScript, this works using prototypal inheritance

*/
const enemy = {
    attack: () => console.log("Pim Pam Pum!"),
    flyAway: () => console.log("Flyyyy like an eagle!")
}

// We declare another object
const bug1 = {
    name: "Buggy McFly",
    phrase: "Your debugger doesn't work with me!"
}

/*

We can set prototype in 3 ways:

1. Object.setPrototypeOf (recommended but slower)
2. __proto__ (not recommended but works)
3. Object.create (best and clean way)

*/

// 1️⃣ using setPrototypeOf
Object.setPrototypeOf(bug1, enemy)

// 2️⃣ using __proto__
// bug1.__proto__ = enemy

// 3️⃣ using Object.create (best)
// const bug1 = Object.create(enemy)
// bug1.name = "Buggy McFly"
// bug1.phrase = "Your debugger doesn't work with me!"

console.log(bug1.phrase)
console.log(bug1.attack())   // Pim Pam Pum!
console.log(bug1.flyAway())  // Flyyyy like an eagle!