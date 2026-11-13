import type { Question } from '../../../types';

export const prototypesQuestions: Question[] = [
  {
    kind: 'output',
    id: 'pr-1',
    title: 'reassigning Fn.prototype after creating instances',
    code: `function Animal(name) {
  this.name = name;
}
Animal.prototype.speak = function () {
  return \`\${this.name} speaks\`;
};
const dog = new Animal('Rex');
Animal.prototype = {
  speak() {
    return 'replaced';
  },
};
const cat = new Animal('Tom');
console.log(dog.speak(), cat.speak(), dog instanceof Animal, cat instanceof Animal);`,
    why: 'Reassigning Animal.prototype does not touch the old object; dog\'s [[Prototype]] still points to it → "Rex speaks". cat links to the new object → "replaced". instanceof asks "is the CURRENT Animal.prototype in your chain?" → dog false, cat true. Same idea as `let a = obj; obj = {}`.',
  },
  {
    kind: 'output',
    id: 'pr-2',
    title: 'MUTATING the prototype instead',
    code: `function Animal(name) {
  this.name = name;
}
Animal.prototype.speak = function () {
  return \`\${this.name} speaks\`;
};
const dog = new Animal('Rex');
Animal.prototype.speak = function () {
  return \`\${this.name} barks\`;
};
console.log(dog.speak(), Object.hasOwn(dog, 'speak'), 'speak' in dog);`,
    why: 'Mutating the shared prototype object is visible to every existing instance. speak is not an own property of dog (it lives on the prototype), but `in` walks the chain.',
  },
  {
    kind: 'output',
    id: 'pr-3',
    title: 'own property shadows the prototype',
    code: `const proto = {
  greet() {
    return 'proto';
  },
};
const obj = Object.create(proto);
obj.greet = () => 'own';
console.log(obj.greet());
delete obj.greet;
console.log(obj.greet());
delete obj.greet;
console.log(obj.greet());`,
    why: 'Lookup checks the object itself first, then up the chain. delete only removes OWN properties, so the second delete does nothing; the prototype method stays.',
  },
  {
    kind: 'output',
    id: 'pr-4',
    title: 'array on the prototype is shared',
    code: `function Team() {}
Team.prototype.members = [];
const t1 = new Team();
const t2 = new Team();
t1.members.push('ann');
t2.members = ['bob'];
console.log(t1.members, t2.members, new Team().members);`,
    why: 'push MUTATES the single array that lives on the prototype (shared by all instances). Assigning t2.members creates an own property that shadows it. Classic bug: put per-instance state in the constructor.',
  },
  {
    kind: 'output',
    id: 'pr-5',
    title: 'constructor that returns something',
    code: `function A() {
  this.x = 1;
  return { x: 2 };
}
function B() {
  this.x = 1;
  return 5;
}
console.log(new A().x, new B().x);`,
    why: 'If a constructor returns an OBJECT, `new` gives you that object instead of `this`. Returning a primitive is ignored.',
  },
  {
    kind: 'output',
    id: 'pr-6',
    title: 'parent constructor calls an overridden method',
    code: `class Base {
  constructor() {
    this.init();
  }
  init() {
    this.type = 'base';
  }
}
class Child extends Base {
  name = 'child';
  init() {
    this.type = \`child:\${this.name}\`;
  }
}
console.log(new Child().type);`,
    why: "Class fields are initialised right AFTER super() returns. Base's constructor calls the overridden init before Child's `name` field exists → \"child:undefined\". Don't call overridable methods from a constructor.",
  },
  {
    kind: 'output',
    id: 'pr-7',
    title: 'walking the chain',
    code: `class X {}
const x = new X();
console.log(
  Object.getPrototypeOf(x) === X.prototype,
  Object.getPrototypeOf(X.prototype) === Object.prototype,
  Object.getPrototypeOf(Object.prototype),
  X.prototype.constructor === X,
  typeof X,
);`,
    why: 'x → X.prototype → Object.prototype → null. Every prototype has a constructor pointing back. A class is just a function.',
  },
];
