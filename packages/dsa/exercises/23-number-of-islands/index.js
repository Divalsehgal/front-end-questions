/**
 * 23. Number of Islands
 * https://leetcode.com/problems/number-of-islands/
 *
 * grid is a 2D map of '1' (land) and '0' (water).
 * An island is land connected up, down, left or right. Return the number of islands.
 *
 * Examples
 *   grid = [
 *     ["1","1","1","1","0"],
 *     ["1","1","0","1","0"],
 *     ["1","1","0","0","0"],
 *     ["0","0","0","0","0"],
 *   ]  ->  1
 *
 *   grid = [
 *     ["1","1","0","0","0"],
 *     ["1","1","0","0","0"],
 *     ["0","0","1","0","0"],
 *     ["0","0","0","1","1"],
 *   ]  ->  3
 *
 * Target complexity: Time O(m * n), Space O(m * n)
 */
import { check } from '../helpers.js';

function numIslands(grid) {
  // your solution
}

check(
  'example 1',
  numIslands([
    ['1', '1', '1', '1', '0'],
    ['1', '1', '0', '1', '0'],
    ['1', '1', '0', '0', '0'],
    ['0', '0', '0', '0', '0'],
  ]),
  1,
);
check(
  'example 2',
  numIslands([
    ['1', '1', '0', '0', '0'],
    ['1', '1', '0', '0', '0'],
    ['0', '0', '1', '0', '0'],
    ['0', '0', '0', '1', '1'],
  ]),
  3,
);
check('all water', numIslands([['0']]), 0);
