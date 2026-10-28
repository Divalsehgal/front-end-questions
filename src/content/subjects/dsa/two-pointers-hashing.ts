import { codeFiles } from '../../files';
import type { Topic } from '../../types';

const code = codeFiles('dsa', import.meta.glob<string>('./files/*', { query: '?raw', import: 'default', eager: true }));

export const twoPointersHashing: Topic = {
  slug: 'two-pointers-hashing',
  title: 'Two pointers & hashing',
  questions: [
    {
      kind: 'code',
      id: 'two-pointer',
      title: 'Two-pointer warm-ups',
      difficulty: 'easy',
      prompt: '`removeElement`, `removeDuplicates`, `moveZeroes` (all in place), `isPalindrome` (alphanumeric only) and `maxArea` (container with most water).',
      ...code('two-pointer'),
    },
    {
      kind: 'code',
      id: 'three-sum',
      title: '3Sum',
      difficulty: 'medium',
      prompt:
        'Find all unique triplets summing to zero, each sorted, in lexicographic order. O(n²): sort, fix one number, two-pointer the rest, and skip duplicates.',
      ...code('three-sum'),
    },
    {
      kind: 'code',
      id: 'hashing',
      title: 'Anagrams & nearby duplicates',
      difficulty: 'easy',
      prompt: '`isAnagram`, `groupAnagrams` (groups in first-seen order) and `containsNearbyDuplicate` (a sliding-window set).',
      ...code('hashing'),
    },
  ],
};
