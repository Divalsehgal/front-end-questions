const board = [
    ["A", "B", "C", "E"],
    ["S", "F", "C", "S"],
    ["A", "D", "E", "E"]
];

const rows = board.length;
const cols = board[0].length;
const visited = Array.from({ length: rows }, () => Array(cols).fill(false));

function dfs(i, j) {
    // Boundary checks
    if (i < 0 || i >= rows || j < 0 || j >= cols || visited[i][j]) {
        return;
    }

    visited[i][j] = true;
    console.log(board[i][j]); // Process the current cell

    // Visit neighbors: down, up, right, left
    dfs(i + 1, j); // Down
    dfs(i - 1, j); // Up
    dfs(i, j + 1); // Right
    dfs(i, j - 1); // Left
}

// Start DFS from top-left cell (0, 0)
dfs(0, 0);
