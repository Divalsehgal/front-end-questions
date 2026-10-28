import { codeFiles } from '../../files';
import type { Topic } from '../../types';

const code = codeFiles('javascript', import.meta.glob<string>('./files/*', { query: '?raw', import: 'default', eager: true }));

export const thisBinding: Topic = {
  slug: 'this',
  title: '`this` binding',
  questions: [
    {
      kind: 'output',
      id: 'th-1',
      title: 'method, detached, arrow, nested',
      code: `const obj = {
  name: 'outer',
  regular() {
    return this?.name;
  },
  arrow: () => this?.name,
  nested() {
    const inner = () => this.name;
    function legacy() {
      return this?.name;
    }
    return [inner(), legacy()];
  },
};
const { regular } = obj;
console.log(obj.regular(), regular(), obj.arrow(), obj.nested());`,
      why: "Regular fn = WHO CALLED ME; arrow = WHERE WAS I WRITTEN. obj.regular() → obj. regular() → no receiver → undefined. arrow is written in an object literal (not a scope) so it borrows module-level this → undefined. inner borrows nested's this (obj). legacy() is a plain call → undefined; it does NOT look outward.",
    },
    {
      kind: 'output',
      id: 'th-2',
      title: 'methods passed to setTimeout',
      code: `const user = {
  name: 'Ann',
  greet() {
    console.log(this === user);
  },
  greetLater() {
    setTimeout(function () {
      console.log(this === user);
    });
  },
  greetLaterArrow() {
    setTimeout(() => console.log(this === user));
  },
};
user.greet();
setTimeout(user.greet);
user.greetLater();
user.greetLaterArrow();`,
      why: "Line 1: user.greet() is a method call → this === user → true. Passing user.greet to setTimeout DETACHES it: the timer calls it with no receiver: in browsers `this` is the global object (window, or self in a worker), in Node a Timeout object; never user → false. A regular function inside greetLater: same → false. The arrow in greetLaterArrow borrows that method's this → true. Fix for detached methods: an arrow wrapper, setTimeout(() => user.greet()), or user.greet.bind(user).",
    },
    {
      kind: 'output',
      id: 'th-3',
      title: 'bind vs call, double bind, new on a bound fn',
      code: `function who() {
  return this?.n;
}
const a = { n: 'a' };
const b = { n: 'b' };
const bound = who.bind(a);
console.log(bound(), bound.call(b), who.bind(a).bind(b)());

function Person(name) {
  this.name = name;
}
const BoundPerson = Person.bind({ name: 'ignored' });
const p = new BoundPerson('Real');
console.log(p.name, p instanceof Person);`,
      why: 'bind is permanent: call/apply and a second bind cannot override it → a a a. But `new` beats bind: the bound this is ignored and a fresh object is created, still instanceof Person.',
    },
    {
      kind: 'output',
      id: 'th-4',
      title: 'class method vs class-field arrow, destructured',
      code: `class Btn {
  label = 'ok';
  handleArrow = () => this.label;
  handle() {
    return this?.label;
  }
}
const { handle, handleArrow } = new Btn();
console.log(handle(), handleArrow());`,
      why: 'Class bodies are always strict, so a detached method gets this = undefined. A class-field arrow is created per instance in the constructor and captures that instance; this is why React class components used `handleClick = () => {}`.',
    },
    {
      kind: 'output',
      id: 'th-5',
      title: 'regular callback inside map, with and without thisArg',
      code: `const obj = {
  prefix: '>',
  list: ['a', 'b'],
  print() {
    return this.list.map(function (x) {
      return this?.prefix + x;
    });
  },
  printFixed() {
    return this.list.map(function (x) {
      return this.prefix + x;
    }, this);
  },
};
console.log(obj.print(), obj.printFixed());`,
      why: 'A regular callback passed to map is called with no receiver → this is undefined → undefined + "a" coerces to "undefineda". map\'s 2nd argument (thisArg) sets it. An arrow callback would also fix it.',
    },
    {
      kind: 'output',
      id: 'th-6',
      title: 'method chaining, then detaching',
      code: `const counter = {
  count: 0,
  inc() {
    this.count++;
    return this;
  },
};
console.log(counter.inc().inc().count);
const inc = counter.inc;
try {
  inc();
} catch (e) {
  console.log(e.name);
}`,
      why: 'Returning `this` enables chaining → 2. Detached inc() has this = undefined, so this.count throws TypeError (reading a property of undefined).',
    },
    {
      kind: 'quiz',
      id: 'q-scope-2',
      title: 'Arrow function `this`',
      prompt: 'Which statement about arrow functions is TRUE?',
      options: [
        'They take `this` from the enclosing (lexical) function and call/apply/bind cannot change it',
        'Their `this` is the object they are defined in, e.g. an object literal',
        'Their `this` is set by whoever calls them',
        'They can be used as constructors with `new`',
      ],
      answer: 0,
      why: "Arrows have no own `this`; they capture it lexically from the enclosing function or module scope, and `call`/`apply`/`bind` can't change it. **Not 'the object they are defined in':** an object literal isn't a scope, so an arrow property gets the outer `this`. **Not 'set by the caller':** that describes regular functions. **Not constructors:** arrows have no `prototype` or `[[Construct]]`, so `new` throws TypeError.",
    },
    {
      kind: 'quiz',
      id: 'q-scope-3',
      title: 'new vs bind',
      prompt: '`const B = A.bind(obj); const x = new B();` What is `this` inside `A`?',
      options: ['A brand new object (instance of A); the bound obj is ignored', 'obj', 'undefined', 'It throws: bound functions cannot be constructed'],
      answer: 0,
      why: "`new` has the highest precedence: constructing a bound function ignores the bound `this` and creates a fresh object linked to `A.prototype` (bound arguments still apply). Precedence: `new` > explicit (`bind`/`call`/`apply`) > method call > plain call. **Not obj:** bind loses to new. **Not undefined:** that is a strict-mode plain call. **Not 'throws':** bound regular functions are constructible (bound arrows aren't, because arrows never are).",
    },
    {
      kind: 'code',
      id: 'call-apply-bind',
      title: 'call / apply / bind polyfills',
      difficulty: 'medium',
      prompt: `Implement \`myCall\`, \`myApply\` and \`myBind\` **without** the native ones.
Hint: temporarily attach \`fn\` to the target under a \`Symbol\` key.

- \`myBind\` prepends preset args and **always** uses \`thisArg\`, even if later called with \`.call(other)\`
- with \`new\`, a bound function ignores \`thisArg\` and creates a real instance (\`instanceof fn\` works)
- an \`undefined\` thisArg means calling \`fn\` with no receiver`,
      ...code('call-apply-bind'),
    },
    {
      kind: 'output',
      id: 'th-7',
      title: 'the `self = this` pattern',
      code: `const b = {
  name: 'Vivek',
  f: function () {
    var self = this;
    console.log('1', this.name);
    (function () {
      console.log('3', self.name);
      console.log('2', this.name);
    })();
  },
};
b.f();`,
      why: 'Inside f (called as b.f()) this is b. The IIFE is a plain call, so in strict mode its this is undefined and this.name throws TypeError. `self` captured b in a closure, which is how code worked before arrow functions.',
    },
    {
      kind: 'order',
      id: 'th-o1',
      title: 'Precedence of `this` rules',
      prompt: 'Order the ways `this` gets decided, from HIGHEST priority to lowest (for regular functions).',
      items: [
        '`new` binding (constructor call)',
        'Explicit binding: `bind` / `call` / `apply`',
        'Implicit binding: method call `obj.fn()`',
        'Default binding: plain call `fn()` (undefined in strict mode)',
      ],
      why: '`new` beats even a bound function. Hard binding beats a method call. Arrow functions sit outside this list entirely: they take `this` from their enclosing scope.',
    },
  ],
};
