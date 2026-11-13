/**
 * 37. Retry
 *
 * Write retry(fn, times, delay). fn returns a promise. Call it; if it rejects, wait
 * delay ms and try again, up to times attempts in total. Resolve with the first
 * success, or reject with the last error when every attempt fails.
 * Follow-up: double the delay after each failure (exponential backoff).
 *
 * Examples
 *   fn fails twice, then returns 'ok'
 *   retry(fn, 3, 10)   ->  'ok' after 3 attempts
 *   retry(fn, 2, 10)   ->  rejects with the 2nd error after 2 attempts
 *
 * Target complexity: Time O(times) attempts, Space O(1)
 */
import { check } from '../helpers.js';

async function retry(fn, times, delay) {
  // your solution
}

const makeFlaky = (failures) => {
  let attempts = 0;
  const fn = async () => {
    attempts++;
    if (attempts <= failures) throw new Error('fail ' + attempts);
    return 'ok';
  };
  fn.attempts = () => attempts;
  return fn;
};

const f1 = makeFlaky(2);
check('succeeds on the third try', await retry(f1, 3, 10), 'ok');
check('made 3 attempts', f1.attempts(), 3);

const f2 = makeFlaky(5);
let error;
try {
  await retry(f2, 2, 10);
} catch (e) {
  error = e.message;
}
check('gives up with the last error', error, 'fail 2');
check('made 2 attempts', f2.attempts(), 2);
