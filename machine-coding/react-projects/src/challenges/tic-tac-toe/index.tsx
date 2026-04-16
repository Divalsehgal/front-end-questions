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
          <h2 className="text-2xl font-black text-text-main flex items-center gap-2 tracking-tight">
            <Swords className="w-7 h-7 text-brand-500" />
            TIC TAC TOE
          </h2>
          <p className="text-sm font-medium text-text-muted">
            {winner === "Draw" ? "It's a draw!" : winner ? "Game Over" : `Player ${isXNext ? "X" : "O"}'s turn`}
          </p>
        </div>
        <button 
          onClick={resetGame}
          className="p-3 bg-muted hover:bg-muted/80 rounded-2xl transition-all active:scale-95 shadow-soft"
        >
          <RotateCcw className="w-5 h-5 text-text-main" />
        </button>
      </div>

      {/* Players Info */}
      <div className="flex gap-4">
        <div className={cn(
          "flex-1 p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2",
          isXNext && !winner ? "border-brand-500 bg-brand-500/10 shadow-hard shadow-brand-500/10" : "border-subtle opacity-50"
        )}>
          <div className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center text-text-inverted shadow-soft">
            <X className="w-6 h-6" strokeWidth={3} />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-brand-500">Player X</span>
        </div>
        <div className={cn(
          "flex-1 p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2",
          !isXNext && !winner ? "border-orange-500 bg-orange-500/10 shadow-hard shadow-orange-500/10" : "border-subtle opacity-50"
        )}>
          <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-text-inverted shadow-soft">
            <Circle className="w-5 h-5" strokeWidth={3} />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-orange-500">Player O</span>
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
                "bg-surface border-subtle shadow-soft",
                "hover:border-brand-500 hover:shadow-hard active:scale-95",
                winningLine?.includes(idx) && "bg-brand-500 border-brand-500 shadow-hard shadow-brand-500/20 scale-105 z-10",
                !cell && !winner && "cursor-pointer",
                winner && "cursor-default"
              )}
            >
              {cell === "X" && (
                <X 
                  strokeWidth={2}
                  className={cn(
                    "w-12 h-12 animate-in zoom-in duration-300",
                    winningLine?.includes(idx) ? "text-text-inverted" : "text-brand-500"
                  )} 
                />
              )}
              {cell === "O" && (
                <Circle 
                  strokeWidth={2.5}
                  className={cn(
                    "w-10 h-10 animate-in zoom-in duration-300",
                    winningLine?.includes(idx) ? "text-text-inverted" : "text-orange-500"
                  )} 
                />
              )}
            </button>
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
                {winner === "Draw" ? "It's a Tie!" : "Winner Found!"}
              </h3>
              {winner !== "Draw" && (
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-text-muted">Player</span>
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center text-text-inverted font-black text-xl",
                    winner === "X" ? "bg-brand-500 shadow-hard shadow-brand-500/30" : "bg-orange-500 shadow-hard shadow-orange-500/30"
                  )}>
                    {winner}
                  </div>
                </div>
              )}
              <button 
                onClick={resetGame}
                className="mt-4 px-6 py-2 bg-brand-500 text-text-inverted font-bold rounded-xl hover:bg-brand-600 transition-all shadow-soft shadow-brand-500/20"
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
