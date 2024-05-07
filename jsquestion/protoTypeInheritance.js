// Object 1 - Prototype
const obj1 = {
  name: 'Dival',
  age: 26,
  print: function () {
    console.log(`This is ${this.name}`);
  },
};

// Object 2 - Inherits from obj1
const obj2 = Object.create(obj1);
obj2.name = 'Minal'; // Overrides name property

obj1.print(); // Output: This is Dival

obj2.print(); // Output: This is Minal

console.log(obj2.age); // Output: 26 (Accessing age property inherited from obj1)

// Modifying obj1 prototype dynamically
obj1.email = 'dival@example.com';

// Accessing dynamically added property from obj2
console.log(obj2.email); // Output: dival@example.com

// Common properties and methods organized in a prototype
function Person(name, age) {
  this.name = name;
  this.age = age;
}

Person.prototype.print = function () {
  console.log(`This is ${this.name}, age ${this.age}`);
};

const obj3 = new Person('Dival', 26);
const obj4 = new Person('Minal', 30);

obj3.print(); // Output: This is Dival, age 26
obj4.print(); // Output: This is Minal, age 30

// Extending prototype dynamically
Person.prototype.email = 'dummy@gmail.com';

console.log(obj3.email); // Output: ""
console.log(obj4.email); // Output: ""

// Overriding method in obj4
obj4.print = function () {
  console.log(`This is ${this.name} and I'm ${this.age} years old.`);
};

obj3.print(); // Output: This is Dival, age 26
obj4.print(); // Output: This is Minal and I'm 30 years old.
