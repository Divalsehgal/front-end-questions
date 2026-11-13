import { lc, type Node } from './types';

export const arraysHashing: Node[] = [
  {
    name: 'Arrays',
    spot: 'Subarray = contiguous slice, order kept. Subset = any combination.',
    steps: ['Subarrays of n: n(n+1)/2', 'Subsets of n: 2^n (backtracking, decision tree)'],
    code: 'for (i = 0; i < n; i++)\n  for (j = i; j < n; j++)\n    sub = arr.slice(i, j + 1)',
    children: [
      {
        name: 'Single Pass Tracking',
        memory: 'Keep the best so far, update as you go',
        children: [
          {
            name: 'Best Time to Buy and Sell Stock',
            url: lc('best-time-to-buy-and-sell-stock'),
            memory: 'Track min price, profit = price - min',
            steps: ['One loop O(n)', 'Cheaper day found: never buy at the older higher price again'],
          },
          {
            name: 'Find Closest Number to Zero',
            url: lc('find-closest-number-to-zero'),
            memory: 'Smallest |x|, tie: pick the larger',
            steps: ['Same as smallest distance', 'On equal distance compare with current pick'],
          },
          {
            name: 'Roman to Integer',
            url: lc('roman-to-integer'),
            memory: 'Current < next: subtract, else add',
            steps: ['MCMXCIV: +1000 -100 +1000 -10 +100 -1 +5'],
          },
        ],
      },
      {
        name: 'Prefix / Suffix',
        memory: 'Precompute from left and right, combine',
        children: [
          {
            name: 'Product of Array Except Self',
            url: lc('product-of-array-except-self'),
            memory: 'Left products, then times running right product',
            steps: ['Pass 1: ans[i] = product of everything left', 'Pass 2: multiply by running right product'],
          },
        ],
      },
      {
        name: 'Sort Then Sweep',
        memory: 'Sort first, then compare with neighbour / last kept',
        children: [
          {
            name: 'Merge Intervals',
            url: lc('merge-intervals'),
            memory: 'Sort by start; overlap if start <= lastEnd',
            steps: ['Overlap: lastEnd = max(lastEnd, end)', 'Else push as new range'],
          },
          {
            name: 'Rank Transform of an Array',
            url: lc('rank-transform-of-an-array'),
            memory: 'Sorted copy, rank unique values in a map',
            steps: ['Copy and sort', 'Assign rank only to new unique values', 'Replace each original with map[value]'],
          },
          {
            name: 'Longest Consecutive Sequence',
            url: lc('longest-consecutive-sequence'),
            memory: 'Sort, count consecutive run, keep max',
            steps: ['Skip duplicates', 'Optimal O(n): Set, start counting only where x-1 is missing'],
          },
        ],
      },
      {
        name: 'Matrix',
        memory: 'Move boundaries inward, or transform',
        children: [
          {
            name: 'Spiral Matrix',
            url: lc('spiral-matrix'),
            memory: 'Walk a side, then shrink that boundary',
            steps: ['top++ top row done', 'right-- right col done', 'bottom-- bottom row done', 'left++ left col done', 'Stop when boundaries cross'],
          },
          {
            name: 'Rotate Image',
            url: lc('rotate-image'),
            memory: 'Transpose, then reverse every row',
          },
        ],
      },
    ],
  },
  {
    name: 'Two Pointers',
    steps: ['Forward pair j = i + 1: find another element ahead (pairs, combinations, brute force)'],
    children: [
      {
        name: 'Opposite Ends',
        memory: 'l = 0, r = n - 1, move inward',
        spot: 'Answer depends on both ends / shrinking range',
        code: 'while (l < r) {\n  sum < target ? l++ : r--\n}',
        children: [
          { name: 'Reverse String', url: lc('reverse-string'), memory: 'Swap, l++, r--' },
          { name: 'Valid Palindrome', url: lc('valid-palindrome'), memory: 'Sanitise, compare ends, move inward' },
          {
            name: 'Two Sum II - Sorted',
            url: lc('two-sum-ii-input-array-is-sorted'),
            memory: 'Sum < target: l++, sum > target: r--',
          },
          {
            name: '3Sum',
            url: lc('3sum'),
            memory: 'Sort, fix i, Two Sum II on the rest',
            steps: ['Sort the array', 'Fix i, run opposite pointers on i+1..n-1', 'Skip when value equals previous (duplicates)'],
          },
          {
            name: 'Container With Most Water',
            url: lc('container-with-most-water'),
            memory: 'Start widest, move the shorter wall',
            steps: ['Area = min(h[l], h[r]) * (r - l)', 'Shorter wall limits area: discard it', 'Brute force two loops = TLE'],
          },
          {
            name: 'Trapping Rain Water',
            url: lc('trapping-rain-water'),
            memory: 'Water = smaller max side - height',
            steps: ['Track maxL and maxR', 'maxL < maxR: process left, else right', 'Add max - height at each step'],
          },
        ],
      },
      {
        name: 'Same Direction',
        memory: 'One pointer per sequence, move on match',
        children: [
          { name: 'Is Subsequence', url: lc('is-subsequence'), memory: 'Move s pointer on match, t pointer always' },
          { name: 'Merge Strings Alternately', url: lc('merge-strings-alternately'), memory: 'While either has chars, push one from each' },
          { name: 'Longest Common Prefix', url: lc('longest-common-prefix'), memory: 'Char i of first string must match all strings' },
          { name: 'Summary Ranges', url: lc('summary-ranges'), memory: 'Extend while consecutive, store start->end, reset' },
        ],
      },
    ],
  },
  {
    name: 'Sliding Window',
    spot: 'Subarray / substring / contiguous range',
    code: 'for (r = 0; r < n; r++) {\n  add(a[r])\n  while (invalid) remove(a[l++])\n  best = max(best, r - l + 1)\n}',
    children: [
      {
        name: 'Fixed Size',
        memory: 'One enters, one leaves',
        children: [
          { name: 'Maximum Average Subarray I', url: lc('maximum-average-subarray-i'), memory: 'sum += a[r] - a[r-k]' },
          {
            name: 'Permutation in String',
            url: lc('permutation-in-string'),
            memory: 'Window of len(s1), compare frequency maps',
            steps: ['Permutation = same frequencies', 'Slide: remove left (delete at 0), add right', 'Maps equal -> true'],
          },
        ],
      },
      {
        name: 'Variable: Longest',
        memory: 'Expand right, shrink while invalid, record max',
        children: [
          {
            name: 'Longest Substring Without Repeating Characters',
            url: lc('longest-substring-without-repeating-characters'),
            memory: 'Duplicate in window -> shrink',
          },
          { name: 'Max Consecutive Ones III', url: lc('max-consecutive-ones-iii'), memory: 'zeroCount > k -> shrink' },
          {
            name: 'Longest Repeating Character Replacement',
            url: lc('longest-repeating-character-replacement'),
            memory: 'window - maxFreq > k -> shrink',
          },
        ],
      },
      {
        name: 'Variable: Shortest',
        memory: 'Expand until valid, shrink while still valid, record min',
        children: [{ name: 'Minimum Size Subarray Sum', url: lc('minimum-size-subarray-sum'), memory: 'sum >= target -> record, shrink' }],
      },
    ],
  },
  {
    name: 'HashMap / Set',
    children: [
      {
        name: 'Frequency Count',
        memory: 'Count chars, then compare / consume',
        children: [
          { name: 'Valid Anagram', url: lc('valid-anagram'), memory: '+1 for s, -1 for t, below 0 -> false' },
          { name: 'Maximum Number of Balloons', url: lc('maximum-number-of-balloons'), memory: 'min(count[c] / need[c]), l and o need 2' },
          { name: 'Group Anagrams', url: lc('group-anagrams'), memory: 'Key = sorted word' },
        ],
      },
      {
        name: 'Complement Lookup',
        memory: 'Seen before? store value -> index',
        children: [
          {
            name: 'Two Sum',
            url: lc('two-sum'),
            memory: 'map has target - x -> answer',
            steps: ['Brute force: j = i + 1', 'Optimal: one pass with map'],
          },
        ],
      },
      {
        name: 'Seen Sets',
        memory: 'One set per group',
        children: [
          {
            name: 'Valid Sudoku',
            url: lc('valid-sudoku'),
            memory: 'Sets for row, col, box',
            steps: ['box = floor(i/3) * 3 + floor(j/3)'],
          },
        ],
      },
    ],
  },
];
