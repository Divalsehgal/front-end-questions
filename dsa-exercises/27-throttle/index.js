/**
 * 27. Throttle
 *
 * Write throttle(fn, wait). It returns a new function that calls fn at most once
 * every wait ms. The first call runs right away; calls inside the wait window are
 * ignored. Keep the arguments and `this` of the call that runs.
 *
 * Examples
 *   t = throttle(log, 50)
 *   t(1); t(2); t(3)         ->  log(1) only
 *   after 50ms, t(4)         ->  log(4)
 *
 * Target complexity: Time O(1) per call, Space O(1)
 */
import { check, wait } from '../helpers.js';

function throttle(fn, wait) {
  // your solution
  

}

const calls = [];
const t = throttle((x) => calls.push(x), 50);
t?.(1);
t?.(2);
t?.(3);
check('first call runs right away, rest ignored', calls, [1]);
await wait(70);
t?.(4);
t?.(5);
check('runs again after the wait', calls, [1, 4]);
