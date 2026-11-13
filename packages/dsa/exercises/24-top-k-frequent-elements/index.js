/**
 * 24. Top K Frequent Elements
 * https://leetcode.com/problems/top-k-frequent-elements/
 *
 * Return the k most frequent elements of nums, in any order.
 * The answer is unique. Aim for better than O(n log n).
 *
 * Examples
 *   nums = [1,1,1,2,2,3], k = 2  ->  [1,2]
 *   nums = [1], k = 1            ->  [1]
 *
 * Target complexity: Time O(n), Space O(n)
 */
import { check } from '../helpers.js';

function topKFrequent(nums, k) {
  // your solution
}

const sorted = (a) => (Array.isArray(a) ? [...a].sort((x, y) => x - y) : a);

check('example 1', sorted(topKFrequent([1, 1, 1, 2, 2, 3], 2)), [1, 2]);
check('single', sorted(topKFrequent([1], 1)), [1]);
check('negatives', sorted(topKFrequent([4, 4, -1, -1, -1, 2], 2)), [-1, 4]);
