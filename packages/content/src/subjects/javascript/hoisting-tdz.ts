import type { Topic } from '../../types';

export const hoisting: Topic = {
  slug: 'hoisting-tdz',
  title: 'Hoisting & TDZ',
  questions: [
    {
      kind: 'output',
      id: 'ho-1',
      title: 'typeof on var, let, function',
      code: `console.log(typeof a, typeof b, typeof c);
var a = 1;
let b = 2;
function c() {}
console.log(typeof d);`,
      why: 'typeof b throws ReferenceError because b is in the TDZ, so nothing prints. TDZ applies in sloppy AND strict mode. TDZ is the only case where `typeof` on a bare name throws; typeof an undeclared name (d) is safe and gives "undefined".',
    },
    {
      kind: 'output',
      id: 'ho-2',
      title: 'same as ho-1 without the let',
      code: `console.log(typeof a, typeof c, typeof d);
var a = 1;
function c() {}`,
      why: 'var is hoisted and initialised to undefined; function declarations are hoisted with their body; undeclared d is safe with typeof.',
    },
    {
      kind: 'output',
      id: 'ho-3',
      title: 'var and function with the same name',
      code: `console.log(typeof foo);
var foo = 1;
function foo() {}
console.log(typeof foo);`,
      why: 'Function declarations win at hoisting time (foo is the function). Then `var foo = 1` runs as a plain assignment, so afterwards it is a number.',
    },
    {
      kind: 'output',
      id: 'ho-4',
      title: 'calling function expressions early',
      code: `try {
  sayHi();
} catch (e) {
  console.log(e.name);
}
try {
  sayBye();
} catch (e) {
  console.log(e.name);
}
var sayHi = function () {
  console.log('hi');
};
const sayBye = () => console.log('bye');`,
      why: 'Only the `var sayHi` declaration is hoisted (as undefined), so calling it is calling undefined → TypeError. `const sayBye` is in the TDZ → ReferenceError.',
    },
    {
      kind: 'output',
      id: 'ho-5',
      title: 'shadowing let inside a function',
      code: `let x = 'outer';
function f() {
  console.log(x);
  let x = 'inner';
}
try {
  f();
} catch (e) {
  console.log(e.name);
}
console.log(x);`,
      why: 'The inner `let x` is hoisted to the top of f and shadows the outer x for the WHOLE function body, so reading it before the let line is a TDZ ReferenceError. The outer x is untouched.',
    },
    {
      kind: 'output',
      id: 'ho-6',
      title: 'var inside an if that never runs',
      code: `var v = 1;
function g() {
  console.log(v);
  if (false) {
    var v = 2;
  }
  console.log(v);
}
g();`,
      why: 'var ignores blocks: `var v` inside the if is hoisted to the top of g and shadows the outer v, but the assignment never runs → undefined, undefined.',
    },
  ],
};
