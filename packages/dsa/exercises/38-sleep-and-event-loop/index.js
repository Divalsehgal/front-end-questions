/**
 * 38. Sleep and Event Loop Order
 *
 * Part 1: write sleep(ms), which returns a promise that resolves after ms.
 *
 * Part 2: without running it, write down the order this code pushes letters:
 *   order.push('A');
 *   setTimeout(() => order.push('B'), 0);
 *   Promise.resolve().then(() => order.push('C'));
 *   queueMicrotask(() => order.push('D'));
 *   order.push('E');
 * Put your answer in myGuess. Be ready to explain the call stack, the microtask
 * queue and the task (macrotask) queue.
 *
 * Examples
 *   await sleep(50)   ->  resumes after about 50ms
 *
 * Target complexity: Time O(1), Space O(1)
 */
import { check, wait } from '../helpers.js';

function sleep(ms) {
  // your solution
}

const myGuess = []; // your answer, e.g. ['A', ...]

const start = Date.now();
await sleep(50);
check('sleep waited about 50ms', Date.now() - start >= 45, true);

const order = [];
order.push('A');
setTimeout(() => order.push('B'), 0);
Promise.resolve().then(() => order.push('C'));
queueMicrotask(() => order.push('D'));
order.push('E');
await wait(10);
check('event loop order', myGuess, order);
