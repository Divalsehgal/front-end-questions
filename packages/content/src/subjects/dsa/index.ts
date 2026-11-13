import { arraysStrings } from './arrays-strings';
import { backtrackingDp } from './backtracking-dp';
import { complexity } from './complexity';
import { searchSort } from './search-sort';
import { stacksLists } from './stacks-lists';
import { treesHeapsGraphs } from './trees-heaps-graphs';
import { twoPointersHashing } from './two-pointers-hashing';
import type { Subject } from '../../types';

export const dsa: Subject = {
  slug: 'dsa',
  title: 'Data structures & algorithms',
  blurb:
    'Arrays, two pointers, hashing, stacks, linked lists, binary search, sorting, trees, heaps, graphs, backtracking and dynamic programming, all with tests that also catch slow solutions.',
  icon: 'workflow',
  topics: [complexity, arraysStrings, twoPointersHashing, stacksLists, searchSort, treesHeapsGraphs, backtrackingDp],
};
