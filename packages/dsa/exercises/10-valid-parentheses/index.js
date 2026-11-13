/**
 * 10. Valid Parentheses
 * https://leetcode.com/problems/valid-parentheses/
 *
 * s contains only '(', ')', '{', '}', '[' and ']'.
 * Return true if every bracket is closed by the same type, in the correct order.
 *
 * Examples
 *   s = "()"       ->  true
 *   s = "()[]{}"   ->  true
 *   s = "(]"       ->  false
 *   s = "([)]"     ->  false
 *   s = "{[]}"     ->  true
 *
 * Target complexity: Time O(n), Space O(n)
 */
import { check } from '../helpers.js';
const obj = {
  "}": "{",
  ")": "(",
  "]": "["
}
function isValid(s) {
  const stack = [];
  for (let i = 0; i < s.length; i++) {
    const peek = stack[stack.length - 1];
    if (stack.length > 0 && obj[s[i]] === peek) {
      stack.pop()
    } else {
      stack.push(s[i])
    }
  }
  return stack.length===0
}

check('example 1', isValid('()'), true);
check('example 2', isValid('()[]{}'), true);
check('example 3', isValid('(]'), false);
check('wrong order', isValid('([)]'), false);
check('nested', isValid('{[]}'), true);
check('only open', isValid('(('), false);
