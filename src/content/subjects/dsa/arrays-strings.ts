import { codeFiles } from '../../files';
import type { Topic } from '../../types';

const code = codeFiles('dsa', import.meta.glob<string>('./files/*', { query: '?raw', import: 'default', eager: true }));

export const arraysStrings: Topic = {
  slug: 'arrays-strings',
  title: 'Arrays & strings',
  questions: [
    {
      kind: 'code',
      id: 'all-subarrays',
      title: 'All subarrays',
      difficulty: 'easy',
      prompt: 'List every contiguous subarray, ordered by start index then length. How many are there for n elements?',
      ...code('all-subarrays'),
    },
    {
      kind: 'code',
      id: 'rotate-array',
      title: 'Rotate an array in place',
      difficulty: 'medium',
      prompt: 'Rotate right by `k` steps **in place** with O(1) extra space (no slice/splice). Hint: three reversals.',
      ...code('rotate-array'),
    },
    {
      kind: 'code',
      id: 'longest-common-prefix',
      title: 'Longest common prefix',
      difficulty: 'easy',
      prompt: 'Return the longest prefix shared by every string (empty string if none).',
      ...code('longest-common-prefix'),
    },
    {
      kind: 'code',
      id: 'merge-intervals',
      title: 'Merge intervals',
      difficulty: 'medium',
      prompt: 'Merge all overlapping (or touching) intervals and return them sorted by start, without mutating the input.',
      ...code('merge-intervals'),
    },
    {
      kind: 'code',
      id: 'min-difference',
      title: 'Minimum difference of k scores',
      difficulty: 'easy',
      prompt: 'Pick any `k` scores so that (highest − lowest) is as small as possible. Hint: sort, then slide a window of size k.',
      ...code('min-difference'),
    },
    {
      kind: 'code',
      id: 'pivot-index',
      title: 'Pivot index',
      difficulty: 'easy',
      prompt:
        'Find the leftmost index where the sum to its left equals the sum to its right, or -1. It must work with negative numbers (a "half the total" shortcut breaks with negatives).',
      ...code('pivot-index'),
    },
    {
      kind: 'code',
      id: 'shuffle',
      title: 'Fisher–Yates shuffle',
      difficulty: 'easy',
      prompt:
        'Shuffle in place so every permutation is equally likely. The test measures the distribution, so `sort(() => Math.random() - 0.5)` and other biased approaches fail.',
      ...code('shuffle'),
    },
    {
      kind: 'code',
      id: 'spiral-matrix',
      title: 'Spiral matrix',
      difficulty: 'medium',
      prompt: 'Generate an n×n spiral filled with 1..n², and read any m×n matrix in spiral order (watch non-square shapes).',
      ...code('spiral-matrix'),
    },
    {
      kind: 'code',
      id: 'subarray-sum',
      title: 'Subarray with a given sum (negatives allowed)',
      difficulty: 'medium',
      prompt:
        'Return the first contiguous subarray summing to `target`. Numbers can be negative, so a sliding window breaks. Trying every start is O(n²) and fine; bonus: prefix sums + a hash map make it O(n).',
      ...code('subarray-sum'),
    },
    {
      kind: 'code',
      id: 'string-basics',
      title: 'Title case, GCD of strings, palindrome permutation',
      difficulty: 'easy',
      prompt:
        'Three warm-ups: `titleCase`, `gcdOfStrings` (hint: the length of the answer divides both lengths), and `isPalindromePermutation` (hint: at most one odd count).',
      ...code('string-basics'),
    },
    {
      kind: 'code',
      id: 'farthest-seat',
      title: 'Maximize distance to the closest person',
      difficulty: 'medium',
      prompt:
        'Given seats (1 taken, 0 empty), return the largest possible distance to the closest person. Gaps at the edges count fully; gaps between people count half.',
      ...code('farthest-seat'),
    },
  ],
};
