/**
 * 11. Min Stack
 * https://leetcode.com/problems/min-stack/
 *
 * Design a stack that supports push, pop, top and getMin, all in O(1) time.
 * getMin returns the smallest element currently in the stack.
 *
 * Examples
 *   push(-2), push(0), push(-3)
 *   getMin() -> -3
 *   pop()
 *   top()    -> 0
 *   getMin() -> -2
 *
 * Target complexity: Every operation O(1) time, Space O(n)
 */
import { check } from '../helpers.js';

class MinStack {
  constructor() {
    // your solution
  }

  push(val) {}

  pop() {}

  top() {}

  getMin() {}
}

const s = new MinStack();
s.push(-2);
s.push(0);
s.push(-3);
check('getMin after pushes', s.getMin(), -3);
s.pop();
check('top after pop', s.top(), 0);
check('getMin after pop', s.getMin(), -2);
