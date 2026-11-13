/**
 * 06. Longest Substring Without Repeating Characters
 * https://leetcode.com/problems/longest-substring-without-repeating-characters/
 *
 * Return the length of the longest substring of s with no repeated characters.
 *
 * Examples
 *   s = "abcabcbb"  ->  3   ("abc")
 *   s = "bbbbb"     ->  1   ("b")
 *   s = "pwwkew"    ->  3   ("wke")
 *   s = ""          ->  0
 *
 * Target complexity: Time O(n), Space O(min(n, charset))
 */
import { check } from '../helpers.js';

function lengthOfLongestSubstring(s) {

  let left=0;
  const obj={};
  let max=0;
  for (let i = 0; i < s.length; i++) {
    if (obj[s[i]]) {
      obj[s[i]] = obj[s[i]] + 1
      while(obj[s[i]]>1){
        obj[s[left]]--;
        if(obj[s[left]]===0){
          delete obj[s[left]]
        }
        left++
      }
    } else {
      obj[s[i]] = 1
    }
    max=Math.max(max,i-left+1)
  }

 
  return max
}

check('example 1', lengthOfLongestSubstring('abcabcbb'), 3);
check('example 2', lengthOfLongestSubstring('bbbbb'), 1);
check('example 3', lengthOfLongestSubstring('pwwkew'), 3);
check('empty', lengthOfLongestSubstring(''), 0);
