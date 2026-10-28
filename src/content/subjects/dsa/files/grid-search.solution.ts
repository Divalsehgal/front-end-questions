export function exist(board: string[][], word: string): boolean {
  const rows = board.length;
  const cols = rows > 0 ? board[0].length : 0;
  const visited = board.map((row) => row.map(() => false));

  function dfs(i: number, j: number, index: number): boolean {
    if (index === word.length) return true; // matched every letter
    if (i < 0 || i >= rows || j < 0 || j >= cols) return false;
    if (visited[i][j] || board[i][j] !== word[index]) return false;

    visited[i][j] = true;
    const found =
      dfs(i + 1, j, index + 1) || // down
      dfs(i - 1, j, index + 1) || // up
      dfs(i, j + 1, index + 1) || // right
      dfs(i, j - 1, index + 1); // left
    visited[i][j] = false; // undo, so another path can use this cell
    return found;
  }

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (dfs(i, j, 0)) return true;
    }
  }
  return false;
}

// Every time we find unvisited land, that's a new island. Then visit all of its land.
export function numIslands(grid: string[][]): number {
  const rows = grid.length;
  const cols = rows > 0 ? grid[0].length : 0;
  const visited = grid.map((row) => row.map(() => false));
  let count = 0;

  function dfs(i: number, j: number) {
    if (i < 0 || i >= rows || j < 0 || j >= cols) return;
    if (visited[i][j] || grid[i][j] !== '1') return;
    visited[i][j] = true;
    dfs(i + 1, j);
    dfs(i - 1, j);
    dfs(i, j + 1);
    dfs(i, j - 1);
  }

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (grid[i][j] === '1' && !visited[i][j]) {
        count++;
        dfs(i, j);
      }
    }
  }
  return count;
}
