/**
 * 13. Longest Valid Parentheses
 * https://leetcode.com/problems/longest-valid-parentheses/
 *
 * s contains only '(' and ')'.
 * Return the length of the longest well-formed (valid) parentheses substring.
 *
 * Examples
 *   s = "(()"      ->  2   ("()")
 *   s = ")()())"   ->  4   ("()()")
 *   s = ""         ->  0
 *   s = "()(())"   ->  6
 *
 * Target complexity: Time O(n), Space O(n)
 */
import { check } from '../helpers.js';

function longestValidParentheses(s) {
  // your solution
}

check('example 1', longestValidParentheses('(()'), 2);
check('example 2', longestValidParentheses(')()())'), 4);
check('empty', longestValidParentheses(''), 0);
check('whole string', longestValidParentheses('()(())'), 6);
