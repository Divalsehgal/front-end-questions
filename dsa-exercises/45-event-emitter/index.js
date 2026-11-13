/**
 * 45. Event Emitter
 *
 * Write an EventEmitter class:
 *   on(event, listener)      add a listener; many listeners per event, called in order
 *   off(event, listener)     remove that listener (also works for a once listener)
 *   emit(event, ...args)     call every listener with args; return true if any ran
 *   once(event, listener)    like on, but removed after its first call
 *
 * Examples
 *   e.on('hi', a); e.on('hi', b); e.emit('hi', 1)   ->  a(1), b(1)
 *   e.off('hi', a); e.emit('hi', 2)                 ->  b(2)
 *   e.once('bye', c); e.emit('bye'); e.emit('bye')  ->  c runs once
 *   e.emit('nobody')                                ->  false
 *
 * Target complexity: Time O(listeners) per emit or off, O(1) per on, Space O(listeners)
 */
import { check } from '../helpers.js';

class EventEmitter {
  constructor() {
    // your solution
  }

  on(event, listener) {}

  off(event, listener) {}

  emit(event, ...args) {}

  once(event, listener) {}
}

const e = new EventEmitter();
const log = [];
const a = (x) => log.push('a' + x);
const b = (x) => log.push('b' + x);

e.on('hi', a);
e.on('hi', b);
e.emit('hi', 1);
check('all listeners in order', log, ['a1', 'b1']);

e.off('hi', a);
e.emit('hi', 2);
check('off removes one listener', log, ['a1', 'b1', 'b2']);

e.once('bye', (x) => log.push('once' + x));
e.emit('bye', 1);
e.emit('bye', 2);
check('once runs one time', log, ['a1', 'b1', 'b2', 'once1']);

const never = () => log.push('never');
e.once('x', never);
e.off('x', never);
e.emit('x');
check('off works on a once listener', log.includes('never'), false);

check('emit returns true when a listener ran', e.emit('hi', 3), true);
check('emit returns false with no listeners', e.emit('nobody'), false);
