import { lc, type Node } from './types';

export const heapsBacktrackingDp: Node[] = [
  {
    name: 'Heap / Top K',
    steps: ['JS has no heap: write a small MinHeap or use a sorted array in interviews'],
    children: [
      {
        name: 'Size-K Heap',
        memory: 'Min-heap of size k keeps the k largest',
        spot: 'Kth largest / top k / k closest',
        children: [
          {
            name: 'Kth Largest Element in an Array',
            url: lc('kth-largest-element-in-an-array'),
            memory: 'Push, pop when size > k, top is answer',
            steps: ['Alt: quickselect O(n) average'],
          },
          {
            name: 'Top K Frequent Elements',
            url: lc('top-k-frequent-elements'),
            memory: 'Count, then bucket by frequency',
            steps: ['bucket[freq] = [nums]', 'Walk buckets from high to low until k'],
          },
        ],
      },
      {
        name: 'K-Way Merge',
        memory: 'Heap holds the head of every list',
        children: [
          {
            name: 'Merge k Sorted Lists',
            url: lc('merge-k-sorted-lists'),
            memory: 'Pop smallest, attach, push its next',
            steps: ['No heap: merge lists in pairs (divide and conquer)'],
          },
        ],
      },
    ],
  },
  {
    name: 'Backtracking',
    code: 'bt(start, path):\n  record(path)\n  for i from start: path.push(x[i]); bt(i + 1, path); path.pop()',
    children: [
      {
        name: 'Choose / Explore / Undo',
        memory: 'push, recurse, pop',
        children: [
          {
            name: 'Subsets',
            url: lc('subsets'),
            memory: 'Record every path, recurse from i + 1',
            steps: ['Total 2^n'],
          },
          {
            name: 'Combination Sum',
            url: lc('combination-sum'),
            memory: 'Recurse from i (reuse allowed), stop when sum > target',
          },
          {
            name: 'Permutations',
            url: lc('permutations'),
            memory: 'Pick any unused element, used[] array',
            code: 'perm(s):\n  if s.length <= 1 return [s]\n  for i: for p of perm(s without i)\n    push(s[i] + p)',
          },
        ],
      },
    ],
  },
  {
    name: 'Dynamic Programming',
    steps: ['State: what dp[i] means', 'Transition: build dp[i] from smaller answers', 'Base case, then iterate in order'],
    children: [
      {
        name: '1D: Previous Steps',
        memory: 'dp[i] from dp[i-1], dp[i-2]',
        children: [
          { name: 'Climbing Stairs', url: lc('climbing-stairs'), memory: 'dp[i] = dp[i-1] + dp[i-2]' },
          { name: 'House Robber', url: lc('house-robber'), memory: 'dp[i] = max(dp[i-1], dp[i-2] + nums[i])' },
        ],
      },
      {
        name: 'Unbounded Choices',
        memory: 'For each amount, try every option',
        children: [
          {
            name: 'Coin Change',
            url: lc('coin-change'),
            memory: 'dp[a] = min(dp[a - coin] + 1)',
            steps: ['dp[0] = 0, rest Infinity', 'Infinity at end -> -1'],
          },
          {
            name: 'Word Break',
            url: lc('word-break'),
            memory: 'dp[i] = some j: dp[j] && s[j..i] in dict',
            steps: ['dp[0] = true'],
          },
        ],
      },
      {
        name: 'Subsequence',
        memory: 'Match -> extend, else best of skipping',
        children: [
          {
            name: 'Longest Increasing Subsequence',
            url: lc('longest-increasing-subsequence'),
            memory: 'dp[i] = 1 + max dp[j] where a[j] < a[i]',
            steps: ['O(n log n): tails array + binary search'],
          },
          {
            name: 'Longest Common Subsequence',
            url: lc('longest-common-subsequence'),
            memory: 'Equal: 1 + dp[i-1][j-1], else max(up, left)',
          },
        ],
      },
    ],
  },
];
