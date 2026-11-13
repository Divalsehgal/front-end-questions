/**
 * 33. Polyfill call, apply and bind
 *
 * Add myCall, myApply and myBind to Function.prototype without using the built-in
 * call, apply or bind.
 *   myCall(thisArg, ...args)   calls the function with that this
 *   myApply(thisArg, argsArray)
 *   myBind(thisArg, ...args)   returns a new function; more args can be added later
 * Do not leave any extra property behind on thisArg.
 *
 * Examples
 *   greet = function (greeting, mark) { return `${greeting}, ${this.name}${mark}` }
 *   greet.myCall({ name: 'Asha' }, 'Hi', '!')       ->  'Hi, Asha!'
 *   greet.myApply({ name: 'Asha' }, ['Hello', '.'])  ->  'Hello, Asha.'
 *   greet.myBind({ name: 'Asha' }, 'Hey')('?')       ->  'Hey, Asha?'
 *
 * Target complexity: Time O(n) for n arguments, Space O(n)
 */
import { check } from '../helpers.js';

Function.prototype.myCall = function (thisArg, ...args) {
  // your solution
  return this.bind(thisArg,...args)()
};

Function.prototype.myApply = function (thisArg, args) {
  // your solution
  return this.bind(thisArg, ...args)()
};

Function.prototype.myBind = function (thisArg, ...args) {
  // your solution
};

function greet(greeting, mark) {
  return `${greeting}, ${this.name}${mark}`;
}
const person = { name: 'Asha' };
check('myCall', greet.myCall(person, 'Hi', '!'), 'Hi, Asha!');
check('myApply', greet.myApply(person, ['Hello', '.']), 'Hello, Asha.');
check('myBind with later args', greet.myBind(person, 'Hey')?.('?'), 'Hey, Asha?');
check('no extra keys left on thisArg', Object.getOwnPropertySymbols(person).concat(Object.keys(person)), ['name']);
