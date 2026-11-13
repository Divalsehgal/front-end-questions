import type { Topic } from '../../types';

export const complexity: Topic = {
  slug: 'complexity',
  title: 'Complexity & choosing a structure',
  questions: [
    {
      kind: 'order',
      id: 'cx-o1',
      title: 'Rank the growth rates',
      prompt: 'Order these from FASTEST to SLOWEST growing (best to worst for large n).',
      items: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)', 'O(n²)', 'O(2ⁿ)'],
      why: 'At n = 1,000,000: log n ≈ 20, n log n ≈ 20M, n² = 10¹². Exponential is hopeless beyond n ≈ 40, which is why naive recursion for fib/canSum needs memoization.',
    },
    {
      kind: 'quiz',
      id: 'cx-q1',
      title: 'Picking the data structure',
      prompt: 'You repeatedly need the smallest element of a changing collection (insert + remove-min). Which structure?',
      options: ['A binary heap (priority queue): O(log n) insert and remove-min', 'A sorted array: O(1) min but O(n) insert', 'A hash map', 'A linked list'],
      answer: 0,
      why: 'A binary heap keeps the minimum at the root and restores order in O(log n) after an insert or a remove-min, which is exactly this workload (scheduling, Dijkstra, top-k, merging k lists). **Not sorted array:** O(1) to read the min, but every insert shifts elements, O(n). **Not hash map:** no ordering at all, finding the min is an O(n) scan. **Not linked list:** unsorted means O(n) to find the min; kept sorted means O(n) to insert.',
    },
    {
      kind: 'quiz',
      id: 'cx-q2',
      title: 'Hash map costs',
      prompt: 'What is the average and worst-case lookup time of a hash map?',
      options: ['O(1) average, O(n) worst case (everything collides)', 'O(log n) always', 'O(1) always', 'O(n) average'],
      answer: 0,
      why: 'A good hash spreads keys across buckets, so lookup is O(1) on average; if every key collides into one bucket it degrades to scanning that bucket, O(n). **Not O(log n) always:** that is a balanced tree, not a hash table. **Not O(1) always:** collisions make the worst case linear (which is why some runtimes randomise hash seeds). **Not O(n) average:** only the pathological case is linear. JS `Map`/`Set` also preserve insertion order.',
    },
    {
      kind: 'quiz',
      id: 'cx-q3',
      title: 'Memoization vs tabulation',
      prompt: 'Which statements about dynamic programming are true?',
      options: [
        'It applies when a problem has overlapping subproblems and optimal substructure',
        'Memoization is top-down recursion plus a cache; tabulation fills a table bottom-up',
        'Tabulation avoids recursion depth limits and often allows O(1)-space rolling variables',
        'DP always needs O(n²) memory',
      ],
      answer: [0, 1, 2],
      why: 'DP fits problems with overlapping subproblems and optimal substructure; memoization is the top-down recursion plus a cache, tabulation fills a table bottom-up, and the loop form avoids stack-depth limits and often needs only the last row or two (fib, house robber in O(1) space). **Not always O(n²) memory:** memory depends on the state space; many DPs are O(n) or O(1). Recipe: brute-force recursion, spot repeated arguments, cache them, optionally invert into a loop.',
    },
    {
      kind: 'quiz',
      id: 'cx-q4',
      title: 'Sorting trade-offs',
      prompt: 'Which sort guarantees O(n log n) in the worst case AND is stable?',
      options: ['Merge sort', 'Quick sort', 'Selection sort', 'Heap sort'],
      answer: 0,
      why: 'Merge sort always splits in half and merges in linear time, so it is O(n log n) worst case, and merging takes from the left half on ties, so it is stable (cost: O(n) extra space). **Not quick sort:** O(n²) worst case with bad pivots, and not stable. **Not selection sort:** O(n²) always and not stable. **Not heap sort:** O(n log n) worst case but heap operations reorder equal keys, so not stable. V8 uses TimSort; since ES2019 `Array.prototype.sort` must be stable.',
    },
    {
      kind: 'flashcard',
      id: 'cx-f1',
      title: 'Pattern recognition',
      front:
        'Which technique do these signals point to: "sorted array", "contiguous subarray", "next greater", "all combinations", "shortest path in an unweighted grid", "top k"?',
      back: `- **sorted array** → binary search or two pointers
- **contiguous subarray / window** → sliding window, or prefix sums + hash map (when there are negatives)
- **next greater / previous smaller** → monotonic stack
- **all combinations / permutations** → backtracking
- **shortest path, unweighted** → BFS (weighted → Dijkstra with a heap)
- **top k / k-th largest** → heap of size k
- **counting / "seen before"** → hash map or set
- **"number of ways" / min-max over choices** → dynamic programming`,
    },
  ],
};
