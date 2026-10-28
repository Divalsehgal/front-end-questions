import { codeFiles } from '../../files';
import type { Topic } from '../../types';

const code = codeFiles('dsa', import.meta.glob<string>('./files/*', { query: '?raw', import: 'default', eager: true }));

export const searchSort: Topic = {
  slug: 'search-sort',
  title: 'Searching & sorting',
  questions: [
    {
      kind: 'code',
      id: 'binary-search',
      title: 'Binary search (3 ways)',
      difficulty: 'easy',
      prompt: "Iterative and recursive binary search, plus `lowerBound` (first index ≥ target). The test counts reads to make sure it's O(log n).",
      ...code('binary-search'),
    },
    {
      kind: 'code',
      id: 'elementary-sorts',
      title: 'Bubble, selection & insertion sort',
      difficulty: 'easy',
      prompt: 'Implement the three O(n²) sorts without `Array.prototype.sort`, returning new arrays. Which one is fast on nearly-sorted input, and why?',
      ...code('elementary-sorts'),
    },
    {
      kind: 'code',
      id: 'merge-sort',
      title: 'Merge sort',
      difficulty: 'medium',
      prompt: 'Write `mergeSorted` (merge two sorted arrays), then a stable O(n log n) `mergeSort` on top of it.',
      ...code('merge-sort'),
    },
    {
      kind: 'code',
      id: 'quick-sort',
      title: 'Quick sort',
      difficulty: 'medium',
      prompt: 'In-place quicksort with a partition scheme. It must not hit O(n²) or a stack overflow on already-sorted input: choose the pivot wisely.',
      ...code('quick-sort'),
    },
  ],
};
