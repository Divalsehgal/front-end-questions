/**
 * 16. Koko Eating Bananas
 * https://leetcode.com/problems/koko-eating-bananas/
 *
 * piles[i] bananas are in pile i. Each hour Koko picks one pile and eats up to k
 * bananas from it (if the pile has fewer, she finishes it and waits for the hour).
 * Return the smallest k that lets her eat everything within h hours.
 *
 * Examples
 *   piles = [3,6,7,11], h = 8         ->  4
 *   piles = [30,11,23,4,20], h = 5    ->  30
 *   piles = [30,11,23,4,20], h = 6    ->  23
 *
 * Target complexity: Time O(n log m) where m = largest pile, Space O(1)
 */
import { check } from '../helpers.js';

function minEatingSpeed(piles, h) {
  // your solution
}

check('example 1', minEatingSpeed([3, 6, 7, 11], 8), 4);
check('example 2', minEatingSpeed([30, 11, 23, 4, 20], 5), 30);
check('example 3', minEatingSpeed([30, 11, 23, 4, 20], 6), 23);
