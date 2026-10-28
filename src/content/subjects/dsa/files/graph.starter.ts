/** Undirected graph with an adjacency list (Map<vertex, Set<vertex>>). */
export class Graph {
  addVertex(v: string): void {
    // your code
  }
  addEdge(a: string, b: string): void {
    // your code (adds missing vertices)
  }
  removeEdge(a: string, b: string): void {
    // your code
  }
  removeVertex(v: string): void {
    // your code (also removes its edges)
  }
  hasEdge(a: string, b: string): boolean {
    // your code
  }
  /** Depth-first order from start, visiting neighbours in insertion order. */
  dfs(start: string): string[] {
    // your code
  }
  /** Breadth-first order from start. */
  bfs(start: string): string[] {
    // your code
  }
  /** Fewest-edges path from a to b (inclusive), or null. */
  shortestPath(a: string, b: string): string[] | null {
    // your code
  }
}

/**
 * Build a directed adjacency list from items and connections:
 * items [{ id, name }], connections [{ source: name, destination: name }]
 * → { A: ['B', 'C'], B: [], ... } with every item present, even without edges.
 */
export function buildAdjacencyList(items: { id: number; name: string }[], connections: { source: string; destination: string }[]): Record<string, string[]> {
  // your code
}
