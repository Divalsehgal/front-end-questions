/**
 * 17. Merge Intervals
 * https://leetcode.com/problems/merge-intervals/
 *
 * Merge all overlapping intervals and return the non-overlapping result.
 * Intervals that touch (end == start) count as overlapping.
 *
 * Examples
 *   intervals = [[1,3],[2,6],[8,10],[15,18]]  ->  [[1,6],[8,10],[15,18]]
 *   intervals = [[1,4],[4,5]]                 ->  [[1,5]]
 *   intervals = [[4,7],[1,4]]                 ->  [[1,7]]
 *
 * Target complexity: Time O(n log n), Space O(n)
 */
import { check } from '../helpers.js';

function merge(intervals) {
  // your solution
}

check('example 1', merge([[1, 3], [2, 6], [8, 10], [15, 18]]), [[1, 6], [8, 10], [15, 18]]);
check('touching', merge([[1, 4], [4, 5]]), [[1, 5]]);
check('unsorted', merge([[4, 7], [1, 4]]), [[1, 7]]);
check('contained', merge([[1, 10], [2, 3]]), [[1, 10]]);
