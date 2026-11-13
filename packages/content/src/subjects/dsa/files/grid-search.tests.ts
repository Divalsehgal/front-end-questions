import { exist, numIslands } from './solution';
const board = [
  ['A', 'B', 'C', 'E'],
  ['S', 'F', 'C', 'S'],
  ['A', 'D', 'E', 'E'],
];
test('word search', () => {
  assert.equal(exist(board, 'ABCCED'), true);
  assert.equal(exist(board, 'SEE'), true);
  assert.equal(exist(board, 'ABCB'), false, 'cells cannot be reused');
});
test('islands', () => {
  const grid = [
    ['1', '1', '0', '0', '0'],
    ['1', '1', '0', '0', '0'],
    ['0', '0', '1', '0', '0'],
    ['0', '0', '0', '1', '1'],
  ];
  const copy = JSON.stringify(grid);
  assert.equal(numIslands(grid), 3);
  assert.equal(JSON.stringify(grid), copy, 'input grid was mutated');
  assert.equal(numIslands([['0']]), 0);
});
