export class Graph {
  private adjacencyList: Record<string, Set<string>> = {};

  addVertex(vertex: string): void {
    if (!this.adjacencyList[vertex]) {
      this.adjacencyList[vertex] = new Set();
    }
  }

  addEdge(a: string, b: string): void {
    this.addVertex(a);
    this.addVertex(b);
    this.adjacencyList[a].add(b);
    this.adjacencyList[b].add(a);
  }

  removeEdge(a: string, b: string): void {
    if (this.adjacencyList[a]) this.adjacencyList[a].delete(b);
    if (this.adjacencyList[b]) this.adjacencyList[b].delete(a);
  }

  removeVertex(vertex: string): void {
    if (!this.adjacencyList[vertex]) return;
    for (const neighbour of this.adjacencyList[vertex]) {
      this.adjacencyList[neighbour].delete(vertex);
    }
    delete this.adjacencyList[vertex];
  }

  hasEdge(a: string, b: string): boolean {
    return Boolean(this.adjacencyList[a] && this.adjacencyList[a].has(b));
  }

  private neighbours(vertex: string): Set<string> {
    return this.adjacencyList[vertex] || new Set();
  }

  // Go as deep as possible before going wide.
  dfs(start: string): string[] {
    const visited: string[] = [];
    const seen = new Set<string>();
    const visit = (vertex: string) => {
      seen.add(vertex);
      visited.push(vertex);
      for (const neighbour of this.neighbours(vertex)) {
        if (!seen.has(neighbour)) visit(neighbour);
      }
    };
    visit(start);
    return visited;
  }

  // Visit everything one step away, then two steps away, and so on.
  bfs(start: string): string[] {
    const visited: string[] = [];
    const seen = new Set<string>([start]);
    const queue = [start];
    let i = 0; // read position, instead of queue.shift()
    while (i < queue.length) {
      const vertex = queue[i];
      i++;
      visited.push(vertex);
      for (const neighbour of this.neighbours(vertex)) {
        if (!seen.has(neighbour)) {
          seen.add(neighbour);
          queue.push(neighbour);
        }
      }
    }
    return visited;
  }

  // BFS finds the path with the fewest edges. Remember where we came from to rebuild it.
  shortestPath(a: string, b: string): string[] | null {
    const cameFrom: Record<string, string | null> = { [a]: null };
    const queue = [a];
    let i = 0;
    while (i < queue.length) {
      const vertex = queue[i];
      i++;
      if (vertex === b) {
        const path: string[] = [];
        let current: string | null = b;
        while (current !== null) {
          path.unshift(current);
          current = cameFrom[current];
        }
        return path;
      }
      for (const neighbour of this.neighbours(vertex)) {
        if (!(neighbour in cameFrom)) {
          cameFrom[neighbour] = vertex;
          queue.push(neighbour);
        }
      }
    }
    return null;
  }
}

export function buildAdjacencyList(items: { id: number; name: string }[], connections: { source: string; destination: string }[]) {
  const list: Record<string, string[]> = {};
  for (const item of items) {
    list[item.name] = [];
  }
  for (const { source, destination } of connections) {
    if (!list[source]) list[source] = [];
    list[source].push(destination);
  }
  return list;
}
