/**
 * 12. Decode String
 * https://leetcode.com/problems/decode-string/
 *
 * Decode a string where k[text] means text repeated k times.
 * Brackets can be nested. Input is always valid.
 *
 * Examples
 *   s = "3[a]2[bc]"      ->  "aaabcbc"
 *   s = "3[a2[c]]"       ->  "accaccacc"
 *   s = "2[abc]3[cd]ef"  ->  "abcabccdcdcdef"
 *
 * Target complexity: Time O(output length), Space O(output length)
 */
import { check } from '../helpers.js';

function decodeString(s) {
  // your solution
}

check('example 1', decodeString('3[a]2[bc]'), 'aaabcbc');
check('nested', decodeString('3[a2[c]]'), 'accaccacc');
check('example 3', decodeString('2[abc]3[cd]ef'), 'abcabccdcdcdef');
check('multi-digit', decodeString('10[a]'), 'aaaaaaaaaa');
