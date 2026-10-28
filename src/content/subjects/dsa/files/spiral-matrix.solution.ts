// Walk the outside ring (top row, right column, bottom row, left column), then move the edges in.
export function spiralOrder(matrix: number[][]): number[] {
  const result: number[] = [];
  if (matrix.length === 0) return result;
  let startR = 0;
  let endR = matrix.length - 1;
  let startC = 0;
  let endC = matrix[0].length - 1;

  while (startR <= endR && startC <= endC) {
    for (let j = startC; j <= endC; j++) result.push(matrix[startR][j]);
    startR++;
    for (let j = startR; j <= endR; j++) result.push(matrix[j][endC]);
    endC--;
    if (startR <= endR) {
      for (let j = endC; j >= startC; j--) result.push(matrix[endR][j]);
      endR--;
    }
    if (startC <= endC) {
      for (let j = endR; j >= startR; j--) result.push(matrix[j][startC]);
      startC++;
    }
  }
  return result;
}

export function generateSpiral(n: number): number[][] {
  const grid: number[][] = [];
  for (let i = 0; i < n; i++) grid[i] = [];
  let count = 0;
  let startR = 0;
  let endR = n - 1;
  let startC = 0;
  let endC = n - 1;

  while (startR <= endR && startC <= endC) {
    for (let j = startC; j <= endC; j++) {
      count++;
      grid[startR][j] = count;
    }
    startR++;
    for (let j = startR; j <= endR; j++) {
      count++;
      grid[j][endC] = count;
    }
    endC--;
    for (let j = endC; j >= startC; j--) {
      count++;
      grid[endR][j] = count;
    }
    endR--;
    for (let j = endR; j >= startR; j--) {
      count++;
      grid[j][startC] = count;
    }
    startC++;
  }
  return grid;
}
