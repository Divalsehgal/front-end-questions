/**
 * 02. Group Anagrams
 * https://leetcode.com/problems/group-anagrams/
 *
 * Given an array of strings, group the anagrams together.
 * Return the groups in any order.
 *
 * Examples
 *   strs = ["eat","tea","tan","ate","nat","bat"]  ->  [["bat"],["nat","tan"],["ate","eat","tea"]]
 *   strs = [""]                                  ->  [[""]]
 *   strs = ["a"]                                 ->  [["a"]]
 *
 * Target complexity: Time O(n * k log k) where k = longest word, Space O(n * k)
 */
import { check, unordered } from '../helpers.js';

function groupAnagrams(strs) {
  const obj={}
  for(let i=0;i<strs.length;i++){
    const str=strs[i].split("").sort().join("");
    if(obj[str]){
      obj[str].push(strs[i])
    }else{
      obj[str]=[strs[i]]
    }
  }
  return Object.values(obj)
  // your solution
}

check(
  'example 1',
  unordered(groupAnagrams(['eat', 'tea', 'tan', 'ate', 'nat', 'bat'])),
  unordered([['bat'], ['nat', 'tan'], ['ate', 'eat', 'tea']]),
);
check('example 2', unordered(groupAnagrams([''])), [['']]);
check('example 3', unordered(groupAnagrams(['a'])), [['a']]);
