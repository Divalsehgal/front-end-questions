import { useState } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { RotateCcw } from "lucide-react";

const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

type Player = "X" | "O";
type Cell = Player | null;
type Board = Cell[][];

// Nested Array.from gives each row its own array. Array(3).fill(Array(3))
// would make every row the same reference.
const createBoard = (): Board =>
  Array.from({ length: 3 }, () => Array.from({ length: 3 }, () => null));

const WINNING_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
  [0, 4, 8], [2, 4, 6],            // diagonals
];

function getWinner(board: Board): Player | null {
  const flat = board.flat();
  for (const [a, b, c] of WINNING_LINES) {
    if (flat[a] && flat[a] === flat[b] && flat[a] === flat[c]) return flat[a];
  }
  return null;
}

const playerName = (p: Player) => (p === "X" ? "Player 1" : "Player 2");

export default function TicTacToe() {
  const [board, setBoard] = useState<Board>(createBoard);
  const [current, setCurrent] = useState<Player>("X");

  // Derived from the board, so they can never get out of sync.
  const winner = getWinner(board);
  const isDraw = !winner && board.flat().every(Boolean);
  const gameOver = Boolean(winner) || isDraw;

  const play = (i: number, j: number) => {
    if (gameOver || board[i][j]) return;
    setBoard((prev) =>
      prev.map((row, r) => row.map((cell, c) => (r === i && c === j ? current : cell)))
    );
    setCurrent((p) => (p === "X" ? "O" : "X"));
  };

  const reset = () => {
    setBoard(createBoard());
    setCurrent("X");
  };

  const status = winner
    ? `${playerName(winner)} (${winner}) wins`
    : isDraw
      ? "Draw"
      : `${playerName(current)}'s turn (${current})`;

  return (
    <div className="mx-auto max-w-sm space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-main">Tic-tac-toe</h2>
          <p className="text-sm text-text-muted" aria-live="polite">{status}</p>
        </div>
        <button
          type="button"
          onClick={reset}
          aria-label="Reset game"
          className="rounded-lg bg-muted p-2.5 transition-colors hover:bg-muted/80"
        >
          <RotateCcw className="size-5 text-text-main" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {board.map((row, i) =>
          row.map((cell, j) => (
            <button
              key={`${i}-${j}`}
              type="button"
              onClick={() => play(i, j)}
              disabled={gameOver || Boolean(cell)}
              aria-label={`Row ${i + 1}, column ${j + 1}${cell ? `, ${cell}` : ""}`}
              className={cn(
                "flex aspect-square items-center justify-center rounded-xl border-2 border-border-subtle bg-surface text-4xl font-bold transition-colors",
                "enabled:hover:border-brand-500 disabled:cursor-default",
                cell === "X" ? "text-brand-500" : "text-orange-500"
              )}
            >
              {cell}
            </button>
          ))
        )}
      </div>

      {gameOver && (
        <button
          type="button"
          onClick={reset}
          className="w-full rounded-lg bg-brand-500 py-2.5 font-semibold text-white transition-colors hover:bg-brand-600"
        >
          Play again
        </button>
      )}
    </div>
  );
}
