import { codeFiles } from '../../files';
import type { Topic } from '../../types';

const code = codeFiles('dsa', import.meta.glob<string>('./files/*', { query: '?raw', import: 'default', eager: true }));

export const backtrackingDp: Topic = {
  slug: 'backtracking-dp',
  title: 'Backtracking & dynamic programming',
  questions: [
    {
      kind: 'code',
      id: 'backtracking',
      title: 'Subsets & permutations',
      difficulty: 'medium',
      prompt: 'Generate the power set (iteratively) and all permutations (choose → explore → un-choose). State both complexities.',
      ...code('backtracking'),
    },
    {
      kind: 'code',
      id: 'dp-fib-grid',
      title: 'Fibonacci & grid traveler',
      difficulty: 'easy',
      prompt: 'Fibonacci with memoization and with tabulation, and `gridTraveler(m, n)`. Naive recursion times out, so the tests force you to cache.',
      ...code('dp-fib-grid'),
    },
    {
      kind: 'code',
      id: 'dp-target-sum',
      title: 'canSum, howSum, bestSum',
      difficulty: 'medium',
      prompt: 'The classic decision → construction → optimization trio over reusable numbers. Memoize on the remaining target.',
      ...code('dp-target-sum'),
    },
    {
      kind: 'code',
      id: 'dp-construct',
      title: 'canConstruct, countConstruct, allConstruct',
      difficulty: 'medium',
      prompt: 'Build a target string from reusable words: can you, in how many ways, and list every way. Only branch on words that are prefixes.',
      ...code('dp-construct'),
    },
    {
      kind: 'code',
      id: 'dp-classics',
      title: 'House robber, stock, coin change, LIS',
      difficulty: 'hard',
      prompt:
        'Four interview classics: `rob` (non-adjacent max sum), `maxProfit` (one transaction), `coinChange` (fewest coins, tabulation) and `lengthOfLIS` (bonus: O(n log n)).',
      ...code('dp-classics'),
    },
  ],
};
