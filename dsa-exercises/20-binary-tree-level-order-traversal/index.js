/**
 * 20. Binary Tree Level Order Traversal
 * https://leetcode.com/problems/binary-tree-level-order-traversal/
 *
 * Return the values of a binary tree level by level, left to right.
 *
 * Examples
 *   root = [3,9,20,null,null,15,7]  ->  [[3],[9,20],[15,7]]
 *   root = [1]                      ->  [[1]]
 *   root = []                       ->  []
 *
 * Target complexity: Time O(n), Space O(n)
 */
import { check, arrayToTree } from '../helpers.js';

// node shape: { val, left, right }
function levelOrder(root) {
  // your solution
}

check('example 1', levelOrder(arrayToTree([3, 9, 20, null, null, 15, 7])), [[3], [9, 20], [15, 7]]);
check('single', levelOrder(arrayToTree([1])), [[1]]);
check('empty', levelOrder(arrayToTree([])), []);
