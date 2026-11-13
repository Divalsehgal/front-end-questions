import { arraysHashing } from './arrays-hashing';
import { heapsBacktrackingDp } from './heaps-backtracking-dp';
import { stacksListsSearch } from './stacks-lists-search';
import { treesGraphs } from './trees-graphs';
import type { Node } from './types';

export type { Node } from './types';

/** Root, then category, then pattern, then question. */
export const root: Node = { name: 'DSA', children: [...arraysHashing, ...stacksListsSearch, ...treesGraphs, ...heapsBacktrackingDp] };
