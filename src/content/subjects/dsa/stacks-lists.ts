import { codeFiles } from '../../files';
import type { Topic } from '../../types';

const code = codeFiles('dsa', import.meta.glob<string>('./files/*', { query: '?raw', import: 'default', eager: true }));

export const stacksLists: Topic = {
  slug: 'stacks-lists',
  title: 'Stacks, queues & linked lists',
  questions: [
    {
      kind: 'code',
      id: 'stacks',
      title: 'Stack problems',
      difficulty: 'medium',
      prompt: '`isValidParentheses`, `nextGreaterElement` and `dailyTemperatures`. The last two are the monotonic-stack pattern and must be O(n).',
      ...code('stacks'),
    },
    {
      kind: 'code',
      id: 'queue-two-stacks',
      title: 'Queue from two stacks',
      difficulty: 'easy',
      prompt: "Implement a FIFO queue using two arrays as stacks (push/pop only; `shift` is disabled because it's O(n)). Explain the amortised O(1).",
      ...code('queue-two-stacks'),
    },
    {
      kind: 'code',
      id: 'linked-list',
      title: 'Doubly linked list + reverse',
      difficulty: 'medium',
      prompt: 'Build a doubly linked list with O(1) add/remove at both ends and `toArray`, then reverse a singly linked list iteratively.',
      ...code('linked-list'),
    },
  ],
};
