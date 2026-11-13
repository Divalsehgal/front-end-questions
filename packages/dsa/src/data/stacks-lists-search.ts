import { lc, type Node } from './types';

export const stacksListsSearch: Node[] = [
  {
    name: 'Stack',
    children: [
      {
        name: 'Monotonic Stack',
        memory: 'Future element resolves past ones',
        children: [
          {
            name: 'Daily Temperatures',
            url: lc('daily-temperatures'),
            memory: 'Stack of unresolved indices, pop while warmer',
            steps: ['ans filled with 0', 'While t[i] > t[top]: ans[top] = i - top, pop', 'Push i'],
          },
          {
            name: 'Next Greater Element I',
            url: lc('next-greater-element-i'),
            memory: 'Same as Daily Temperatures, store value not distance',
            steps: ['Run stack over nums2, map[popped] = current', 'Answer nums1 from map, default -1'],
          },
        ],
      },
      {
        name: 'Auxiliary Stack',
        memory: 'Second stack tracks the extra info',
        children: [
          {
            name: 'Min Stack',
            url: lc('min-stack'),
            memory: 'Push to min if <= top, pop from min if equal',
          },
        ],
      },
    ],
  },
  {
    name: 'Linked List',
    children: [
      {
        name: 'Pointer Rewiring',
        memory: 'Save next before you break a link',
        children: [
          {
            name: 'Reverse Linked List',
            url: lc('reverse-linked-list'),
            memory: 'temp = cur.next, cur.next = prev, prev = cur, cur = temp',
            steps: ['prev becomes the new head'],
          },
          {
            name: 'Remove Duplicates from Sorted List',
            url: lc('remove-duplicates-from-sorted-list'),
            memory: 'Same as next -> skip it, return head',
          },
          {
            name: 'Merge Two Sorted Lists',
            url: lc('merge-two-sorted-lists'),
            memory: 'Dummy node, attach smaller, attach leftover',
            steps: ['Return dummy.next'],
          },
        ],
      },
      {
        name: 'Fast & Slow / Gap',
        memory: 'slow 1 step, fast 2 steps (or fixed gap)',
        spot: 'Cycle, middle, nth from end',
        children: [
          {
            name: 'Linked List Cycle',
            url: lc('linked-list-cycle'),
            memory: 'They meet -> cycle',
            steps: ['Set of nodes: O(n) space', 'Floyd: O(1) space'],
          },
          { name: 'Middle of the Linked List', url: lc('middle-of-the-linked-list'), memory: 'Fast at end -> slow at middle' },
          {
            name: 'Remove Nth Node From End of List',
            url: lc('remove-nth-node-from-end-of-list'),
            memory: 'Ahead n steps, move both, behind.next = behind.next.next',
          },
        ],
      },
      {
        name: 'Old -> New Map',
        memory: 'Map original node to copy',
        children: [
          {
            name: 'Copy List with Random Pointer',
            url: lc('copy-list-with-random-pointer'),
            memory: 'Pass 1 create copies, pass 2 wire next and random',
            steps: ['Return map.get(head)'],
          },
        ],
      },
      {
        name: 'HashMap + Doubly Linked List',
        memory: 'Map for O(1) lookup, list for O(1) order',
        children: [
          {
            name: 'LRU Cache',
            url: lc('lru-cache'),
            memory: 'Touch = move to front, full = drop tail',
            steps: [
              'get: missing -> -1, else move node to front',
              'put: update or insert at front, size > cap -> remove tail and its key',
              'Dummy head and tail avoid null checks',
              'JS shortcut: Map keeps insertion order, delete + set = touch, keys().next() = oldest',
            ],
          },
        ],
      },
    ],
  },
  {
    name: 'Binary Search',
    code: 'let l = 0, r = n - 1\nwhile (l <= r) {\n  mid = l + floor((r - l) / 2)\n  if (a[mid] === t) return mid\n  a[mid] < t ? l = mid + 1 : r = mid - 1\n}',
    children: [
      {
        name: 'Classic',
        memory: 'l <= r, mid +- 1',
        children: [
          { name: 'Search Insert Position', url: lc('search-insert-position'), memory: 'Not found -> return l' },
          { name: 'Valid Perfect Square', url: lc('valid-perfect-square'), memory: 'Compare mid * mid with num' },
          {
            name: 'Search a 2D Matrix',
            url: lc('search-a-2d-matrix'),
            memory: 'Virtual flat array: row = floor(i / cols), col = i % cols',
          },
        ],
      },
      {
        name: 'First True Boundary',
        memory: 'l < r, keep mid with r = mid',
        spot: 'F F F T T T: find the first T',
        children: [
          { name: 'First Bad Version', url: lc('first-bad-version'), memory: 'Bad -> r = mid, good -> l = mid + 1' },
          {
            name: 'Find Minimum in Rotated Sorted Array',
            url: lc('find-minimum-in-rotated-sorted-array'),
            memory: 'a[mid] > a[r] -> l = mid + 1, else r = mid',
          },
          {
            name: 'Search in Rotated Sorted Array',
            url: lc('search-in-rotated-sorted-array'),
            memory: 'Find min index, pick the sorted half, classic search',
          },
          {
            name: 'Search in Rotated Sorted Array II',
            url: lc('search-in-rotated-sorted-array-ii'),
            memory: 'Duplicates: a[l] == a[mid] == a[r] -> l++, r--',
            steps: ['Otherwise find the sorted half and keep the target side', 'Worst case O(n) because of duplicates'],
          },
          {
            name: 'Find Peak Element',
            url: lc('find-peak-element'),
            memory: 'a[mid] < a[mid+1] -> climb right, else r = mid',
            steps: ['Uphill side always has a peak', 'l < r, return l'],
          },
        ],
      },
      {
        name: 'On Answer',
        memory: 'Search the answer range, check feasible',
        children: [
          {
            name: 'Koko Eating Bananas',
            url: lc('koko-eating-bananas'),
            memory: 'First speed that works = First Bad Version',
            steps: ['k in 1..max(piles)', 'hours = sum ceil(pile / k)', 'hours <= h -> r = mid, else l = mid + 1'],
          },
        ],
      },
    ],
  },
];
