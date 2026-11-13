import { Graph, buildAdjacencyList } from './solution';
const sample = () => {
  const g = new Graph();
  [['A', 'B'], ['A', 'C'], ['B', 'D'], ['C', 'D'], ['D', 'E']].forEach(([a, b]) => g.addEdge(a, b));
  return g;
};
test('edges are undirected', () => {
  const g = sample();
  assert.equal(g.hasEdge('A', 'B'), true);
  assert.equal(g.hasEdge('B', 'A'), true);
  assert.equal(g.hasEdge('A', 'E'), false);
});
test('removeEdge and removeVertex', () => {
  const g = sample();
  g.removeEdge('A', 'B');
  assert.equal(g.hasEdge('B', 'A'), false);
  g.removeVertex('D');
  assert.equal(g.hasEdge('C', 'D'), false);
  assert.deepEqual(g.bfs('A'), ['A', 'C']);
});
test('dfs and bfs order', () => {
  const g = sample();
  assert.deepEqual(g.dfs('A'), ['A', 'B', 'D', 'C', 'E']);
  assert.deepEqual(g.bfs('A'), ['A', 'B', 'C', 'D', 'E']);
});
test('shortestPath', () => {
  const g = sample();
  assert.deepEqual(g.shortestPath('A', 'E'), ['A', 'B', 'D', 'E']);
  g.addVertex('Z');
  assert.equal(g.shortestPath('A', 'Z'), null);
  assert.deepEqual(g.shortestPath('A', 'A'), ['A']);
});
test('buildAdjacencyList', () => {
  const items = ['A', 'B', 'C', 'D'].map((name, i) => ({ id: i + 1, name }));
  const connections = [['A', 'B'], ['A', 'C'], ['A', 'D'], ['B', 'C'], ['C', 'D']].map(([source, destination]) => ({ source, destination }));
  assert.deepEqual(buildAdjacencyList(items, connections), { A: ['B', 'C', 'D'], B: ['C'], C: ['D'], D: [] });
});
