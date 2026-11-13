import { lc, type Node } from './types';

export const treesGraphs: Node[] = [
  {
    name: 'Trees',
    steps: ['DFS: recursion (pre, in, post) or stack', 'BFS: queue', 'Balanced: height difference at every node <= 1'],
    children: [
      {
        name: 'Postorder: Return Height',
        memory: 'Ask children first, return 1 + max(L, R)',
        children: [
          {
            name: 'Maximum Depth of Binary Tree',
            url: lc('maximum-depth-of-binary-tree'),
            memory: 'null -> 0, 1 + max(L, R)',
            steps: ['BFS alternative: depth++ per level'],
          },
          { name: 'Invert Binary Tree', url: lc('invert-binary-tree'), memory: 'Swap left and right at every node' },
          { name: 'Balanced Binary Tree', url: lc('balanced-binary-tree'), memory: '|L - R| > 1 -> return -1 up' },
          { name: 'Diameter of Binary Tree', url: lc('diameter-of-binary-tree'), memory: 'Global max of L + R, return max(L, R) + 1' },
          {
            name: 'Binary Tree Maximum Path Sum',
            url: lc('binary-tree-maximum-path-sum'),
            memory: 'Global max of node + L + R, return node + max(L, R)',
            steps: ['Drop negative paths: max(0, child)', 'Complete path goes left -> node -> right', 'Parent only gets one side'],
          },
        ],
      },
      {
        name: 'Two Trees Together',
        memory: 'Both null true, one null / diff false, recurse &&',
        children: [
          { name: 'Same Tree', url: lc('same-tree'), memory: 'Compare left with left, right with right' },
          { name: 'Symmetric Tree', url: lc('symmetric-tree'), memory: 'Outer pair L.left-R.right, inner L.right-R.left' },
          {
            name: 'Subtree of Another Tree',
            url: lc('subtree-of-another-tree'),
            memory: 'sameTree at any node (||)',
          },
        ],
      },
      {
        name: 'Carry State Down',
        memory: 'Pass state to children, check at leaf',
        children: [{ name: 'Path Sum', url: lc('path-sum'), memory: 'Pass remaining sum, leaf -> remaining === val' }],
      },
      {
        name: 'BFS Levels',
        memory: 'size = queue.length, process exactly size',
        children: [
          {
            name: 'Binary Tree Level Order Traversal',
            url: lc('binary-tree-level-order-traversal'),
            memory: 'Freeze size, collect level, push after loop',
          },
        ],
      },
      {
        name: 'BST Inorder = Sorted',
        memory: 'Left -> Root -> Right gives ascending',
        children: [
          { name: 'Kth Smallest Element in a BST', url: lc('kth-smallest-element-in-a-bst'), memory: 'count++ at root, count === k' },
          {
            name: 'Minimum Absolute Difference in BST',
            url: lc('minimum-absolute-difference-in-bst'),
            memory: 'Track prev, min of val - prev',
          },
          { name: 'Validate Binary Search Tree', url: lc('validate-binary-search-tree'), memory: 'val <= prev -> false' },
        ],
      },
      {
        name: 'BST Direction',
        memory: 'Smaller left, bigger right',
        children: [
          {
            name: 'Lowest Common Ancestor of a BST',
            url: lc('lowest-common-ancestor-of-a-binary-search-tree'),
            memory: 'Both smaller left, both bigger right, else current',
          },
        ],
      },
      {
        name: 'Build From Traversals',
        memory: 'Preorder gives root, inorder gives sizes',
        children: [
          {
            name: 'Construct Binary Tree from Preorder and Inorder',
            url: lc('construct-binary-tree-from-preorder-and-inorder-traversal'),
            memory: 'leftSize = index of root in inorder, split preorder',
            steps: ['root = pre[0]', 'leftPre = pre[1 .. 1+leftSize]', 'rightPre = pre[1+leftSize ..]'],
          },
        ],
      },
      {
        name: 'Trie',
        memory: 'One node per char, mark word end',
        children: [
          {
            name: 'Implement Trie (Prefix Tree)',
            url: lc('implement-trie-prefix-tree'),
            memory: 'search needs isEnd, startsWith does not',
          },
        ],
      },
    ],
  },
  {
    name: 'Graph',
    steps: ['Adjacency list: graph[u] = [[v, w], ...]', 'BFS: shortest steps (unweighted)', 'Dijkstra: shortest path, non-negative weights'],
    children: [
      {
        name: 'Grid Flood Fill',
        memory: 'Visit cell, mark it, spread to 4 neighbours',
        spot: '2D grid of connected regions',
        code: 'dirs = [[1,0],[-1,0],[0,1],[0,-1]]\ndfs(r, c):\n  if out of bounds or grid[r][c] !== "1" return\n  grid[r][c] = "0"\n  for [dr, dc] of dirs: dfs(r + dr, c + dc)',
        children: [
          {
            name: 'Number of Islands',
            url: lc('number-of-islands'),
            memory: 'Each unvisited land starts a DFS, count++',
            steps: ['Sink visited land to "0" instead of a visited set'],
          },
          {
            name: 'Rotting Oranges',
            url: lc('rotting-oranges'),
            memory: 'Multi-source BFS: all rotten in queue, minutes = levels',
            steps: ['Count fresh first', 'Each level: rot neighbours, fresh--', 'fresh > 0 at end -> -1'],
          },
        ],
      },
      {
        name: 'Topological Sort',
        memory: 'Indegree 0 goes first (Kahn BFS)',
        spot: 'Prerequisites / dependency order / cycle in directed graph',
        code: 'indeg[v]++ for every edge u -> v\nqueue = nodes with indeg 0\nwhile queue: u = shift, order.push(u)\n  for v of graph[u]: if --indeg[v] === 0 push v',
        children: [
          {
            name: 'Course Schedule',
            url: lc('course-schedule'),
            memory: 'Processed count === n -> no cycle',
            steps: ['Edge: prereq -> course', 'Course Schedule II: return the order'],
          },
        ],
      },
      {
        name: 'Dijkstra',
        memory: 'Pop closest, relax neighbours',
        spot: 'Shortest path / minimum cost with weights >= 0',
        code: 'dist = Infinity, dist[src] = 0\nheap = [[0, src]]\nwhile heap:\n  [d, u] = popMin()\n  if d > dist[u] continue\n  for [v, w] of graph[u]\n    if d + w < dist[v]: dist[v] = d + w, push([dist[v], v])',
        children: [
          {
            name: 'Network Delay Time',
            url: lc('network-delay-time'),
            memory: 'Dijkstra from k, answer = max dist',
            steps: ['Any node still Infinity -> -1', 'JS has no heap: sorted array is fine for interviews'],
          },
        ],
      },
    ],
  },
];
