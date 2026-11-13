/**
 * 18. Add Two Numbers
 * https://leetcode.com/problems/add-two-numbers/
 *
 * Two non-negative numbers are stored as linked lists, digits in reverse order
 * (head is the ones digit). Return their sum as a linked list in the same format.
 *
 * Examples
 *   l1 = [2,4,3], l2 = [5,6,4]                ->  [7,0,8]        (342 + 465 = 807)
 *   l1 = [0], l2 = [0]                        ->  [0]
 *   l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]      ->  [8,9,9,9,0,0,0,1]
 *
 * Target complexity: Time O(max(m, n)), Space O(1) extra (output list does not count)
 */
import { check, arrayToList, listToArray } from '../helpers.js';

// node shape: { val, next }
function addTwoNumbers(l1, l2) {

  function add(t1,t2,carry){
    
  }
  
  // your solution
}

const run = (a, b) => listToArray(addTwoNumbers(arrayToList(a), arrayToList(b)));

check('example 1', run([2, 4, 3], [5, 6, 4]), [7, 0, 8]);
check('zeros', run([0], [0]), [0]);
check('carry at end', run([9, 9, 9, 9, 9, 9, 9], [9, 9, 9, 9]), [8, 9, 9, 9, 0, 0, 0, 1]);
