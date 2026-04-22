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

  for (let [a, b, c] of WINNING_COMBINATIONS) {
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
    <div className="max-w-md mx-auto p-6 space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-text-main flex items-center gap-2 tracking-tight">
            <Swords className="w-7 h-7 text-brand-500" />
            TIC TAC TOE
          </h2>
          <p className="text-sm font-medium text-text-muted">
            {winner ? "Game Over" : `Player ${current === "p1" ? "1" : "2"}'s turn`}
          </p>
        </div>
        <button
          onClick={resetGame}
          className="p-3 bg-muted hover:bg-muted/80 rounded-2xl transition-all active:scale-95 shadow-soft group"
          title="Reset Game"
        >
          <RotateCcw className="w-5 h-5 text-text-main group-hover:rotate-180 transition-transform duration-500" />
        </button>
      </div>

      {/* Players Info */}
      <div className="flex gap-4">
        <div className={cn(
          "flex-1 p-4 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center gap-2",
          current === "p1" && !winner ? "border-brand-500 bg-brand-500/10 shadow-hard shadow-brand-500/10" : "border-subtle opacity-50"
        )}>
          <div className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center text-text-inverted shadow-soft">
            <X className="w-6 h-6" strokeWidth={3} />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-brand-500">Player 1 (0)</span>
        </div>
        <div className={cn(
          "flex-1 p-4 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center gap-2",
          current === "p2" && !winner ? "border-orange-500 bg-orange-500/10 shadow-hard shadow-orange-500/10" : "border-subtle opacity-50"
        )}>
          <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-text-inverted shadow-soft">
            <Circle className="w-5 h-5" strokeWidth={3} />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-orange-500">Player 2 (1)</span>
        </div>
      </div>

      {/* Game Board */}
      <div className="relative group">
        <div className="grid grid-cols-1 gap-3">
          {board.map((row, i) => (
            <div key={i} className="grid grid-cols-3 gap-3">
              {row.map((cell, j) => (
                <button
                  key={j}
                  onClick={() => clickHandler(i, j)}
                  className={cn(
                    "aspect-square rounded-2xl flex items-center justify-center transition-all duration-300 border-2",
                    "bg-surface border-subtle shadow-soft text-2xl font-black",
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
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-canvas/90 backdrop-blur-md px-8 py-6 rounded-3xl shadow-hard border-2 border-brand-500/20 flex flex-col items-center gap-3 animate-in fade-in zoom-in slide-in-from-bottom-4 duration-500 pointer-events-auto">
              <div className="p-4 bg-brand-500/10 rounded-2xl text-brand-500">
                <Trophy className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-text-main uppercase tracking-tighter">
                {winner} wins 🎉
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-text-muted uppercase tracking-widest">Victory for</span>
                <div className={cn(
                  "px-4 py-1 rounded-lg text-text-inverted font-black text-sm uppercase",
                  winner === "p1" ? "bg-brand-500" : "bg-orange-500"
                )}>
                  {winner === "p1" ? "Player 1" : "Player 2"}
                </div>
              </div>
              <button
                onClick={resetGame}
                className="mt-4 px-8 py-3 bg-brand-500 text-text-inverted font-bold rounded-xl hover:bg-brand-600 transition-all shadow-soft shadow-brand-500/20 active:scale-95"
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
