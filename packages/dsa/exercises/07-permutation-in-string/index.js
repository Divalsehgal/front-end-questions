/**
 * 07. Permutation in String
 * https://leetcode.com/problems/permutation-in-string/
 *
 * Return true if s2 contains any rearrangement of s1 as a substring.
 * Both strings are lowercase English letters.
 *
 * Examples
 *   s1 = "ab", s2 = "eidbaooo"  ->  true   ("ba")
 *   s1 = "ab", s2 = "eidboaoo"  ->  false
 *
 * Target complexity: Time O(n) where n = s2.length, Space O(1) (26 letters)
 */
import { check } from '../helpers.js';
function frequency(val) {
  const obj = {}
  for (const i of val) {
    if (obj[i]) {
      obj[i] = obj[i] + 1
    } else {
      obj[i]
    }
  }
  return obj
}

function objAreEqual=(obj1,obj2)=>{

  if(obj1===null|| obj2===null ) return obj1===obj2;

  if(Object.keys(obj1).length !==Object.keys(obj2).length){
    return false
  }


  for(const [key,value] of Object.entries(obj2)){
    if(obj1[key]!==value){
      return false
    }
  }


  return true
  
}

function checkInclusion(s1, s2) {
  // your solution
  const t1 = frequency(s1);
  const t2 = frequency(s2);
  
  if(objAreEqual(t1,t2)) return true;
  let left=0;
  for(const [key,value] of Object.entries(s2)){
    if(key in t1){
      continue
    }else{
      
    }
  }

  for(let end=s1.length;end<s1.length;end++){
    
  }

}

check('example 1', checkInclusion('ab', 'eidbaooo'), true);
check('example 2', checkInclusion('ab', 'eidboaoo'), false);
check('same string', checkInclusion('adc', 'dcda'), true);
