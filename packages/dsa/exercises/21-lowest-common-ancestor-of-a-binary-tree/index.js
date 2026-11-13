/**
 * 21. Lowest Common Ancestor of a Binary Tree
 * https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/
 *
 * Given a binary tree (not a BST) and two nodes p and q that exist in it,
 * return their lowest common ancestor: the deepest node that has both as descendants.
 * A node counts as a descendant of itself.
 *
 * Examples
 *   root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1  ->  3
 *   root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 4  ->  5
 *   root = [1,2], p = 1, q = 2                          ->  1
 *
 * Target complexity: Time O(n), Space O(h) where h = tree height
 */
import { check, arrayToTree, findNode } from '../helpers.js';

// node shape: { val, left, right }. Return the node, not its value.
function lowestCommonAncestor(root, p, q) {
  // your solution
}

const run = (arr, p, q) => {
  const root = arrayToTree(arr);
  return lowestCommonAncestor(root, findNode(root, p), findNode(root, q))?.val;
};

check('example 1', run([3, 5, 1, 6, 2, 0, 8, null, null, 7, 4], 5, 1), 3);
check('example 2', run([3, 5, 1, 6, 2, 0, 8, null, null, 7, 4], 5, 4), 5);
check('example 3', run([1, 2], 1, 2), 1);
