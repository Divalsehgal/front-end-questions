import React, { useState, useEffect } from "react";
import { cn } from "../../utils/cn";
import {
  Trophy,
  RotateCcw,
  Swords,
  User as UserIcon,
  Circle,
  X
} from "lucide-react";

export const hint = `
### Learning Gotchas:
1. **Array Initialization**: Avoid using \`Array(3).fill(Array(3).fill(null))\` as it creates rows that reference the same memory address. Use nested \`Array.from\` to ensures each cell is a unique object.
2. **Safety Checks**: Always validate that the cell is empty AND there is no winner before processing a move. Missing these is a common interview pitfall.
3. **Winner Logic**: Flatten the 2D board into a 1D array to check against a static list of winning index combinations. This is much cleaner than nested loops.
4. **State Immutability**: Use \`map\` to return a brand new board state rather than mutating the existing array, keeping React's rendering predictable.
`;

type Player = "p1" | "p2" | null;
type Cell = { value: string; player: string };
type Board = Cell[][];

const tictac: Board = Array.from({ length: 3 }, () =>
  Array.from({ length: 3 }, () => ({ value: "", player: "" })),
);

const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
  [0, 4, 8], [2, 4, 6],            // Diagonals
];

const checkWinner = (board: Board): string | null => {
  const flat = board.flat();

  for (const [a, b, c] of WINNING_COMBINATIONS) {
    const p = flat[a].player;

    if (p && p === flat[b].player && p === flat[c].player) {
      return p;
    }
  }

  return null;
};

export default function TicTacToe() {
  const [board, setBoard] = useState<Board>(tictac);
  const [current, setCurrent] = useState<"p1" | "p2">("p1");
  const [winner, setWinner] = useState<string | null>(null);

  const clickHandler = (i: number, j: number) => {
    if (winner) return;
    if (board[i][j].value) return;

    setBoard((prev) => {
      return prev.map((row, rIdx) => {
        return row.map((cell, cIdx) => {
          if (rIdx === i && cIdx === j) {
            return {
              value: current === "p1" ? "0" : "1",
              player: current,
            };
          }
          return cell;
        });
      });
    });

    setCurrent((prev) => (prev === "p1" ? "p2" : "p1"));
  };

  const resetGame = () => {
    setBoard(Array.from({ length: 3 }, () =>
      Array.from({ length: 3 }, () => ({ value: "", player: "" })),
    ));
    setCurrent("p1");
    setWinner(null);
  };

  useEffect(() => {
    const res = checkWinner(board);
    if (res) setWinner(res);
  }, [board]);

  return (
    <div className="animate-in fade-in mx-auto max-w-md space-y-8 p-6 duration-700">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="flex items-center gap-2 text-2xl font-black tracking-tight text-text-main">
            <Swords className="size-7 text-brand-500" />
            TIC TAC TOE
          </h2>
          <p className="text-sm font-medium text-text-muted">
            {winner ? "Game Over" : `Player ${current === "p1" ? "1" : "2"}'s turn`}
          </p>
        </div>
        <button
          onClick={resetGame}
          className="group rounded-2xl bg-muted p-3 shadow-soft transition-all hover:bg-muted/80 active:scale-95"
          title="Reset Game"
        >
          <RotateCcw className="size-5 text-text-main transition-transform duration-500 group-hover:rotate-180" />
        </button>
      </div>

      {/* Players Info */}
      <div className="flex gap-4">
        <div className={cn(
          "flex flex-1 flex-col items-center gap-2 rounded-2xl border-2 p-4 transition-all duration-300",
          current === "p1" && !winner ? "border-brand-500 bg-brand-500/10 shadow-hard shadow-brand-500/10" : "border-subtle opacity-50"
        )}>
          <div className="flex size-10 items-center justify-center rounded-full bg-brand-500 text-text-inverted shadow-soft">
            <X className="size-6" strokeWidth={3} />
          </div>
          <span className="text-xs font-bold tracking-widest text-brand-500 uppercase">Player 1 (0)</span>
        </div>
        <div className={cn(
          "flex flex-1 flex-col items-center gap-2 rounded-2xl border-2 p-4 transition-all duration-300",
          current === "p2" && !winner ? "border-orange-500 bg-orange-500/10 shadow-hard shadow-orange-500/10" : "border-subtle opacity-50"
        )}>
          <div className="flex size-10 items-center justify-center rounded-full bg-orange-500 text-text-inverted shadow-soft">
            <Circle className="size-5" strokeWidth={3} />
          </div>
          <span className="text-xs font-bold tracking-widest text-orange-500 uppercase">Player 2 (1)</span>
        </div>
      </div>

      {/* Game Board */}
      <div className="group relative">
        <div className="grid grid-cols-1 gap-3">
          {board.map((row, i) => (
            <div key={i} className="grid grid-cols-3 gap-3">
              {row.map((cell, j) => (
                <button
                  key={j}
                  onClick={() => clickHandler(i, j)}
                  className={cn(
                    "flex aspect-square items-center justify-center rounded-2xl border-2 transition-all duration-300",
                    "border-subtle bg-surface text-2xl font-black shadow-soft",
                    "hover:border-brand-500 hover:shadow-hard active:scale-95",
                    !cell.value && !winner && "cursor-pointer",
                    winner && "cursor-default",
                    cell.player === "p1" ? "text-brand-500" : "text-orange-500"
                  )}
                >
                  {cell.value}
                </button>
              ))}
            </div>
          ))}
        </div>

        {/* Winner Overlay */}
        {winner && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="animate-in fade-in zoom-in slide-in-from-bottom-4 pointer-events-auto flex flex-col items-center gap-3 rounded-3xl border-2 border-brand-500/20 bg-canvas/90 px-8 py-6 shadow-hard backdrop-blur-md duration-500">
              <div className="rounded-2xl bg-brand-500/10 p-4 text-brand-500">
                <Trophy className="size-10" />
              </div>
              <h3 className="text-2xl font-black tracking-tighter text-text-main uppercase">
                {winner} wins 🎉
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold tracking-widest text-text-muted uppercase">Victory for</span>
                <div className={cn(
                  "rounded-lg px-4 py-1 text-sm font-black text-text-inverted uppercase",
                  winner === "p1" ? "bg-brand-500" : "bg-orange-500"
                )}>
                  {winner === "p1" ? "Player 1" : "Player 2"}
                </div>
              </div>
              <button
                onClick={resetGame}
                className="mt-4 rounded-xl bg-brand-500 px-8 py-3 font-bold text-text-inverted shadow-soft shadow-brand-500/20 transition-all hover:bg-brand-600 active:scale-95"
              >
                Play Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
