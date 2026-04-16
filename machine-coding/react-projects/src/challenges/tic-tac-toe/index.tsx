import React, { useState, useCallback, useEffect } from "react";
import { cn } from "../../utils/cn";
import { 
  X, 
  Circle, 
  RotateCcw, 
  Trophy, 
  User as UserIcon,
  Swords
} from "lucide-react";

export const hint = "Classic Tic Tac Toe with symbol selection and win detection";

type Symbol = "X" | "O" | null;

const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
  [0, 4, 8], [2, 4, 6]             // Diagonals
];

export default function TicTacToe() {
  const [board, setBoard] = useState<Symbol[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState<Symbol | "Draw">(null);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);

  const checkWinner = useCallback((currentBoard: Symbol[]) => {
    for (const [a, b, c] of WINNING_COMBINATIONS) {
      if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
        return { winner: currentBoard[a], line: [a, b, c] };
      }
    }
    if (currentBoard.every(cell => cell !== null)) {
      return { winner: "Draw" as const, line: null };
    }
    return { winner: null, line: null };
  }, []);

  const handleClick = (index: number) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = isXNext ? "X" : "O";
    setBoard(newBoard);
    setIsXNext(!isXNext);

    const result = checkWinner(newBoard);
    if (result.winner) {
      setWinner(result.winner);
      setWinningLine(result.line);
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
    setWinningLine(null);
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2 tracking-tight">
            <Swords className="w-7 h-7 text-brand-500" />
            TIC TAC TOE
          </h2>
          <p className="text-sm font-medium text-gray-500">
            {winner === "Draw" ? "It's a draw!" : winner ? "Game Over" : `Player ${isXNext ? "X" : "O"}'s turn`}
          </p>
        </div>
        <button 
          onClick={resetGame}
          className="p-3 bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 rounded-2xl transition-all active:scale-95 shadow-sm"
        >
          <RotateCcw className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
      </div>

      {/* Players Info */}
      <div className="flex gap-4">
        <div className={cn(
          "flex-1 p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2",
          isXNext && !winner ? "border-brand-500 bg-brand-50 dark:bg-brand-500/10 shadow-lg shadow-brand-500/10" : "border-surface-200 dark:border-surface-700 opacity-50"
        )}>
          <div className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center text-white shadow-md">
            <X className="w-6 h-6 stroke-[3px]" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">Player X</span>
        </div>
        <div className={cn(
          "flex-1 p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2",
          !isXNext && !winner ? "border-orange-500 bg-orange-50 dark:bg-orange-500/10 shadow-lg shadow-orange-500/10" : "border-surface-200 dark:border-surface-700 opacity-50"
        )}>
          <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white shadow-md">
            <Circle className="w-5 h-5 stroke-[3px]" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-orange-600 dark:text-orange-400">Player O</span>
        </div>
      </div>

      {/* Game Board */}
      <div className="relative group">
        <div className="grid grid-cols-3 gap-3">
          {board.map((cell, idx) => (
            <button
              key={idx}
              onClick={() => handleClick(idx)}
              className={cn(
                "aspect-square rounded-2xl flex items-center justify-center transition-all duration-300 border-2",
                "bg-white dark:bg-surface-800 border-surface-200 dark:border-surface-700 shadow-sm",
                "hover:border-brand-400 dark:hover:border-brand-600 hover:shadow-md active:scale-95",
                winningLine?.includes(idx) && "bg-brand-500 border-brand-500 shadow-xl shadow-brand-500/20 scale-105 z-10",
                !cell && !winner && "cursor-pointer",
                winner && "cursor-default"
              )}
            >
              {cell === "X" && (
                <X className={cn(
                  "w-12 h-12 stroke-[2px] animate-in zoom-in duration-300",
                  winningLine?.includes(idx) ? "text-white" : "text-brand-500"
                )} />
              )}
              {cell === "O" && (
                <Circle className={cn(
                  "w-10 h-10 stroke-[2.5px] animate-in zoom-in duration-300",
                  winningLine?.includes(idx) ? "text-white" : "text-orange-500"
                )} />
              )}
            </button>
          ))}
        </div>

        {/* Winner Overlay */}
        {winner && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-white/90 dark:bg-surface-900/90 backdrop-blur-md px-8 py-6 rounded-3xl shadow-2xl border-2 border-brand-500/20 flex flex-col items-center gap-3 animate-in fade-in zoom-in slide-in-from-bottom-4 duration-500 pointer-events-auto">
              <div className="p-4 bg-brand-100 dark:bg-brand-900/30 rounded-2xl text-brand-600">
                <Trophy className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">
                {winner === "Draw" ? "It's a Tie!" : "Winner Found!"}
              </h3>
              {winner !== "Draw" && (
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-gray-500">Player</span>
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-xl",
                    winner === "X" ? "bg-brand-500 shadow-lg shadow-brand-500/30" : "bg-orange-500 shadow-lg shadow-orange-500/30"
                  )}>
                    {winner}
                  </div>
                </div>
              )}
              <button 
                onClick={resetGame}
                className="mt-4 px-6 py-2 bg-brand-500 text-white font-bold rounded-xl hover:bg-brand-600 transition-all shadow-md shadow-brand-500/20"
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
