import type { Question } from '../../../types';

export const descriptorsClassesQuestions: Question[] = [
  {
    kind: 'output',
    id: 'ob-1',
    title: 'property flags in strict mode',
    code: `const user = {};
Object.defineProperty(user, 'id', { value: 101, writable: false, enumerable: true, configurable: true });
Object.defineProperty(user, 'secret', { value: '123', enumerable: false });
console.log(Object.keys(user), user.secret);
try {
  user.id = 999;
} catch (e) {
  console.log(e.name);
}
console.log(user.id);`,
    why: 'Non-enumerable properties are hidden from Object.keys / for...in / JSON.stringify but still readable directly. Writing to a non-writable property fails silently in sloppy mode and THROWS TypeError in strict mode (modules and classes are always strict).',
  },
  {
    kind: 'output',
    id: 'ob-2',
    title: 'seal vs freeze',
    code: `const sealed = Object.seal({ item: 'Phone' });
const frozen = Object.freeze({ item: 'Phone' });
const attempt = (label, fn) => {
  try {
    fn();
    console.log(label, 'ok');
  } catch (e) {
    console.log(label, e.name);
  }
};
attempt('seal modify', () => { sealed.item = 'Laptop'; });
attempt('seal add', () => { sealed.extra = 1; });
attempt('seal delete', () => { delete sealed.item; });
attempt('freeze modify', () => { frozen.item = 'Laptop'; });
console.log(sealed.item, frozen.item);`,
    why: 'seal = configurable:false + non-extensible: you can still CHANGE existing values but not add or delete. freeze also sets writable:false, so nothing changes. In strict mode every blocked operation throws TypeError.',
  },
  {
    kind: 'output',
    id: 'ob-3',
    title: 'getters and setters',
    code: `const user = {
  first: 'John',
  last: 'Doe',
  get full() {
    return this.first + ' ' + this.last;
  },
  set full(v) {
    [this.first, this.last] = v.split(' ');
  },
};
console.log(user.full);
user.full = 'Alice Wonderland';
console.log(user.first, user.full);
const circle = { r: 1, get area() { return 3 * this.r ** 2; } };
try {
  circle.area = 100;
} catch (e) {
  console.log(e.name);
}
console.log(circle.area, Object.keys(user));`,
    why: 'Accessors run code on read/write. A getter WITHOUT a setter is read-only: assigning to it throws TypeError in strict mode (silently ignored in sloppy). Accessor properties are enumerable by default when defined in a literal, so full shows up in keys.',
  },
  {
    kind: 'output',
    id: 'ob-4',
    title: 'Proxy with a default value',
    code: `const target = { a: 1 };
const proxy = new Proxy(target, {
  get(obj, key) {
    return key in obj ? obj[key] : 42;
  },
});
console.log(proxy.a, proxy.b, target.b);
proxy.c = 3;
console.log(target.c, 'c' in proxy);`,
    why: 'The get trap intercepts reads only. Missing keys fall back to 42, but the target itself is untouched (target.b is undefined). With no set or has trap, writes and `in` go straight through to the target.',
  },
  {
    kind: 'output',
    id: 'ob-5',
    title: 'static methods are not on instances',
    code: `class Chameleon {
  static colorChange(newColor) {
    this.newColor = newColor;
    return this.newColor;
  }
  constructor({ newColor = 'green' } = {}) {
    this.newColor = newColor;
  }
}
const freddie = new Chameleon({ newColor: 'purple' });
console.log(new Chameleon().newColor, Chameleon.colorChange('orange'));
console.log(freddie.colorChange('orange'));`,
    why: "Static methods live on the class (constructor) itself, not on Chameleon.prototype, so instances can't see them: freddie.colorChange is undefined, and calling it throws TypeError. Inside a static method, this is the class.",
  },
  {
    kind: 'output',
    id: 'ob-6',
    title: 'private # fields vs _protected',
    code: `class Machine {
  #water = 0;
  _power = 100;
  set water(v) { this.#water = v < 0 ? 0 : v; }
  get water() { return this.#water; }
  static hasWater(obj) { return #water in obj; }
}
class Mega extends Machine {
  boost() { this._power += 50; return this._power; }
}
const m = new Mega();
m.water = -5;
console.log(m.water, m.boost(), Object.keys(m));
console.log(Machine.hasWater(m), Machine.hasWater({}));`,
    why: '#fields are truly private: not in Object.keys, not reachable from outside, and not even from subclasses directly (only via the parent\'s methods). `_power` is a convention: an ordinary public property. `#x in obj` is the brand check for "was this made by my class?"',
  },
  {
    kind: 'output',
    id: 'ob-7',
    title: 'Object.assign is shallow',
    code: `const obj1 = { a: 5, b: { c: 6 } };
const obj2 = Object.assign({}, obj1);
const obj3 = { obj1 };
obj1.b.c = 8;
console.log(obj2.b.c, obj3.obj1.b.c);
console.log(Object.assign({}, obj1, obj2, obj3));`,
    why: 'Object.assign copies top-level properties only, so obj2.b is the SAME object as obj1.b and sees c = 8. Later sources win for duplicate keys; obj3 adds a property literally named obj1.',
  },
  {
    kind: 'output',
    id: 'ob-8',
    title: 'return values people forget',
    code: `const newList = [1, 2, 3].push(4);
console.log(newList);
console.log(parseInt('7*6', 10), parseInt('12px'), Number('12px'));
const obj = { hasOwnProperty: 1, foo: 2 };
try {
  obj.hasOwnProperty('foo');
} catch (e) {
  console.log(e.name);
}
console.log(Object.hasOwn(obj, 'foo'));`,
    why: 'push returns the NEW LENGTH, not the array. parseInt reads digits until the first invalid char ("7*6" → 7, "12px" → 12) while Number() needs the whole string (NaN). An own property can shadow Object.prototype.hasOwnProperty; Object.hasOwn is the safe version.',
  },
];
