/**
 * 26. Debounce
 *
 * Write debounce(fn, wait). It returns a new function that delays calling fn
 * until wait ms have passed since the last call. Every new call restarts the timer.
 * fn must receive the latest arguments and the same `this` as the last call.
 *
 * Examples
 *   d = debounce(log, 50)
 *   d(1); d(2); d(3)         ->  nothing logged yet
 *   after 50ms               ->  log(3) runs once
 *
 * Target complexity: Time O(1) per call, Space O(1)
 */
import { check, wait } from '../helpers.js';

function debounce(fn, wait) {
  let timer;
  
  return function inner(...args){
    const context = this;
    if(timer){
      clearTimeout(timer)
    }
    timer=setTimeout(()=>{
      return fn.apply(context,args)
    },wait)
  }
}

const calls = [];
const d = debounce((x) => calls.push(x), 50);
d?.(1);
d?.(2);
d?.(3);
check('not called before wait', calls, []);
await wait(80);
check('called once with the last args', calls, [3]);

d?.(4);
await wait(20);
d?.(5);
await wait(80);
check('each call restarts the timer', calls, [3, 5]);

const obj = { val: 7, out: null };
obj.run = debounce(function () {
  this.out = this.val;
}, 20);
obj.run?.();
await wait(40);
check('keeps this', obj.out, 7);
