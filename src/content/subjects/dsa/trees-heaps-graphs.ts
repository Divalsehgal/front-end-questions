import { codeFiles } from '../../files';
import type { Topic } from '../../types';

const code = codeFiles('dsa', import.meta.glob<string>('./files/*', { query: '?raw', import: 'default', eager: true }));

export const treesHeapsGraphs: Topic = {
  slug: 'trees-heaps-graphs',
  title: 'Trees, heaps & graphs',
  questions: [
    {
      kind: 'flashcard',
      id: 'tg-f1',
      title: 'Tree traversals',
      front: 'Name the four tree traversals and what each is good for.',
      back: `- **In-order** (left, node, right): a BST in sorted order
- **Pre-order** (node, left, right): copy or serialize a tree
- **Post-order** (left, right, node): delete or free, compute heights/sizes bottom-up
- **Level-order** (BFS with a queue): level by level, e.g. the shortest depth or rendering a tree by rows

DFS uses recursion or a stack (O(h) space); BFS uses a queue (O(width)).`,
    },
    {
      kind: 'flashcard',
      id: 'tg-f2',
      title: 'What makes a heap',
      front: 'What are the two properties of a binary heap, and how is it stored?',
      back: `1. **Shape**: a *complete* binary tree (every level full, last level filled left to right), so height is O(log n).
2. **Order**: every parent ≤ its children (min-heap) or ≥ (max-heap). Siblings are unordered.

Stored in an array with no gaps: children of i at 2i+1 and 2i+2, parent at (i−1)>>1. Push = append + bubble up; pop = move the last leaf to the root + sink down.`,
    },
    {
      kind: 'code',
      id: 'bst',
      title: 'Binary search tree',
      difficulty: 'medium',
      prompt:
        'Implement insert, has, min/max, in-/pre-/level-order traversals, height and delete (including the two-children case using the in-order successor).',
      ...code('bst'),
    },
    {
      kind: 'code',
      id: 'heap',
      title: 'Priority queue (binary heap)',
      difficulty: 'medium',
      prompt:
        'Array-backed binary heap with a comparator (min-heap by default): push, pop, peek, size, all O(log n). The test heap-sorts 50k items with `splice`/`shift`/`sort` disabled, so it has to be a real heap.',
      ...code('heap'),
    },
    {
      kind: 'code',
      id: 'graph',
      title: 'Graph: adjacency list, DFS, BFS, shortest path',
      difficulty: 'medium',
      prompt:
        'Undirected graph class (add/remove edges and vertices, hasEdge), DFS and BFS orders, BFS shortest path, plus building a directed adjacency list from items and connections.',
      ...code('graph'),
    },
    {
      kind: 'code',
      id: 'grid-search',
      title: 'Grid DFS: word search & islands',
      difficulty: 'medium',
      prompt: 'Word Search (backtracking, each cell used once) and Number of Islands (flood fill), both on 4-directional grids, without mutating the input.',
      ...code('grid-search'),
    },
  ],
};
