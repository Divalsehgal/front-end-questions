/**
 * 36. Promise Pool (concurrency limit)
 *
 * Write promisePool(tasks, limit). tasks is an array of functions that each return a
 * promise. Run them with at most limit running at the same time; start the next one
 * as soon as any finishes. Resolve with all results in input order.
 *
 * Examples
 *   tasks take 30, 10, 20, 10 ms and resolve to 1, 2, 3, 4
 *   promisePool(tasks, 2)   ->  [1, 2, 3, 4], never more than 2 running at once
 *   promisePool([], 3)      ->  []
 *
 * Target complexity: Time O(n), Space O(n)
 */
import { check } from '../helpers.js';

async function promisePool(tasks, limit) {
  // your solution
}

let running = 0;
let maxRunning = 0;
const task = (value, ms) => () => {
  running++;
  maxRunning = Math.max(maxRunning, running);
  return new Promise((resolve) =>
    setTimeout(() => {
      running--;
      resolve(value);
    }, ms),
  );
};

const results = await promisePool([task(1, 30), task(2, 10), task(3, 20), task(4, 10)], 2);
check('results in input order', results, [1, 2, 3, 4]);
check('never more than limit at once', maxRunning, 2);
check('empty tasks', await promisePool([], 3), []);
