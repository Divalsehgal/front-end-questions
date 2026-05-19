# 🧠 JavaScript Objects + Prototypal Inheritance — Final Master Cheat Sheet

---

## 1. 🧩 Object Equality (Golden Rule)

> Objects are equal **ONLY if they share the same reference**

```js
const a = {};
const b = {};
console.log(a === b); // false

const c = a;
console.log(a === c); // true
```

👉 `=` does NOT copy → it shares memory

---

## 2. 🔗 Ways to Create / Link Objects

### ✅ Assignment (`=`)

* Same object (same memory)

```js
const car = { tyres: 4 };
const x = car;

x.tyres = 10;
console.log(car.tyres); // 10
```

---

### 🟡 `Object.create(proto)`

* New object
* Prototype linked

```js
const base = { tyres: 4 };
const obj = Object.create(base);

console.log(obj.tyres); // 4 (from prototype)
console.log(obj === base); // false
```

---

### 🔵 `new`

* New instance
* Linked to constructor prototype

```js
function Car() {}
const a = new Car();
const b = new Car();

console.log(a === b); // false
```

---

## 3. 🔥 Prototype vs Object (CRITICAL)

* Objects → ❌ different
* Prototypes → ✅ can be same

```js
function A() {}

const x = new A();
const y = new A();

console.log(x === y); // false
console.log(x.__proto__ === y.__proto__); // true
```

---

## 4. 🧠 Prototypal Inheritance (Core Concept)

> Every object has a hidden `[[Prototype]]` (aka `__proto__`)
> JS looks up properties via the **prototype chain**

---

### Basic Example

```js
const animal = {
    eats: true,
    walk() {
        console.log("Animal walks");
    }
};

const rabbit = {
    jumps: true,
    __proto__: animal
};

console.log(rabbit.eats); // true (from animal)
rabbit.walk(); // Animal walks
```

---

## 5. ⚠️ Writing vs Reading

> Reading → checks prototype chain
> Writing → always happens on the object itself

```js
rabbit.walk = function () {
    console.log("Rabbit hops!");
};

rabbit.walk(); // Rabbit hops!
animal.walk(); // Animal walks (unchanged)
```

---

## 6. 🏗️ Modern Way — `Object.create`

```js
const vehicle = {
    wheels: 4,
    drive() { console.log("Vroom!"); }
};

const car = Object.create(vehicle, {
    brand: { value: "Tesla" }
});

console.log(car.brand); // own
car.drive(); // inherited
```

---

## 7. 🏭 Constructor + Prototype (`new`)

```js
function User(name) {
    this.name = name;
}

User.prototype.sayHi = function () {
    console.log(`Hi, I'm ${this.name}`);
};

const john = new User("John");
john.sayHi();
```

👉 Methods are shared via `.prototype`

---

## 8. 🔄 Change Prototype at Runtime

```js
const bird = {
    fly() { console.log("Flap flap!"); }
};

const penguin = {
    swim() { console.log("Splash!"); }
};

Object.setPrototypeOf(penguin, bird);

penguin.fly(); // inherited
```

---

## 9. ⚠️ `__proto__` Reality

```js
const obj = {};
console.log(obj.__proto__ === Object.prototype); // true
```

👉 It points to parent, not a copy

---

## 10. 🔍 Property Descriptors (Internal Structure)

```js
{
  value: "Dival",
  writable: true,
  enumerable: true,
  configurable: true
}
```

### Meaning

* `writable` → change value
* `enumerable` → visible in loops
* `configurable` → delete / redefine

---

## 11. 🔒 `seal` vs ❄️ `freeze`

### `Object.seal()`

* ❌ add/delete
* ✅ modify

```js
configurable: false
writable: true
```

---

### `Object.freeze()`

* ❌ add/delete
* ❌ modify

```js
configurable: false
writable: false
```

---

## 12. 🚨 Silent Failure

```js
const obj = {};
Object.seal(obj);

obj.newProp = 10; // ignored
```

👉 No error (unless strict mode)

---

## 13. 🔍 Prototype Lookup

```js
const parent = { val: 10 };
const child = Object.create(parent);

console.log(child.val); // 10

child.val = 20;
console.log(child.val); // 20
```

👉 Lookup order:

1. Own object
2. Prototype chain

---

## 14. 🧠 Final Mental Model

* `=` → same reference
* `Object.create` → new object + link
* `new` → new instance + shared prototype
* Equality → reference-based
* Prototype → shared
* Write → own object
* Read → prototype chain

---

## 🔥 Interview One-Liner

> JavaScript uses prototypal inheritance where objects delegate to other objects via a prototype chain. Equality is reference-based, and new objects created via `new` or `Object.create` are never equal, though they may share the same prototype.

---
