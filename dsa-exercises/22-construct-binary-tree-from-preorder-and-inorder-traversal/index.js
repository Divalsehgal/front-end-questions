/**
 * 22. Construct Binary Tree from Preorder and Inorder Traversal
 * https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/
 *
 * Given the preorder and inorder traversals of a binary tree with unique values,
 * build and return the tree.
 *
 * Examples
 *   preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]  ->  [3,9,20,null,null,15,7]
 *   preorder = [-1], inorder = [-1]                    ->  [-1]
 *
 * Target complexity: Time O(n), Space O(n)
 */
import { check, treeToArray } from '../helpers.js';

// build nodes with shape { val, left, right }
function buildTree(preorder, inorder) {
  // your solution
}

check('example 1', treeToArray(buildTree([3, 9, 20, 15, 7], [9, 3, 15, 20, 7])), [3, 9, 20, null, null, 15, 7]);
check('single', treeToArray(buildTree([-1], [-1])), [-1]);
check('left only', treeToArray(buildTree([1, 2, 3], [3, 2, 1])), [1, 2, null, 3]);
