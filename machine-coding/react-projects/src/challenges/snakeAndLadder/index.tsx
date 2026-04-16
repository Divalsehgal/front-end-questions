import React, { useState, useCallback } from "react";
import { cn } from "../../utils/cn";
import { 
  Trophy, 
  Dices, 
  User as UserIcon, 
  RotateCcw,
  Zap,
  ArrowRightLeft
} from "lucide-react";

export const hint = "Snake and Ladder game with board generation logic and collision detection";

const SNAKES: Record<number, number> = {
  16: 6,
  47: 26,
  64: 60,
  93: 73,
  95: 75,
  98: 78,
};

const LADDERS: Record<number, number> = {
  1: 38,
  4: 14,
  9: 31,
  21: 42,
  28: 84,
  51: 67,
  71: 91,
  80: 100,
};

export default function SnakeAndLadder() {
  const [playerPositions, setPlayerPositions] = useState([0, 0]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [message, setMessage] = useState("Roll the dice to start!");
  const [lastRoll, setLastRoll] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);

  const rollDice = useCallback(() => {
    if (isRolling || message.includes("wins")) return;

    setIsRolling(true);
    setLastRoll(null);

    setTimeout(() => {
      const roll = Math.ceil(Math.random() * 6);
      setLastRoll(roll);
      
      let newPos = playerPositions[currentPlayer] + roll;
      let statusMsg = `Player ${currentPlayer + 1} rolled a ${roll}`;

      if (newPos > 100) {
        newPos = playerPositions[currentPlayer];
        statusMsg = `Player ${currentPlayer + 1} needs exactly ${100 - playerPositions[currentPlayer]} to win!`;
      } else if (SNAKES[newPos]) {
        statusMsg = `🐍 Oh no! Bitten by a snake at ${newPos}! Falling to ${SNAKES[newPos]}`;
        newPos = SNAKES[newPos];
      } else if (LADDERS[newPos]) {
        statusMsg = `🪜 Great! Climbed a ladder at ${newPos}! Up to ${LADDERS[newPos]}`;
        newPos = LADDERS[newPos];
      }

      const newPositions = [...playerPositions];
      newPositions[currentPlayer] = newPos;
      setPlayerPositions(newPositions);
      setMessage(statusMsg);

      if (newPos === 100) {
        setMessage(`🏆 Player ${currentPlayer + 1} WINS!`);
      } else {
        setCurrentPlayer((prev) => (prev + 1) % 2);
      }
      setIsRolling(false);
    }, 600);
  }, [playerPositions, currentPlayer, isRolling, message]);

  const resetGame = () => {
    setPlayerPositions([0, 0]);
    setCurrentPlayer(0);
    setMessage("Game Reset. Roll the dice!");
    setLastRoll(null);
  };

  const renderCell = (number: number) => {
    const isSnake = SNAKES[number];
    const isLadder = LADDERS[number];
    const players = playerPositions.map((pos, i) => pos === number ? i : -1).filter(i => i !== -1);

    return (
      <div 
        key={number} 
        className={cn(
          "relative h-12 sm:h-16 w-full border border-surface-200 dark:border-surface-700/50 flex flex-col items-center justify-center transition-all",
          (number % 2 === 0) ? "bg-muted/30" : "bg-surface/30",
          isSnake && "bg-error/10",
          isLadder && "bg-success/10"
        )}
      >
        <span className="absolute top-1 left-1 text-tiny font-bold text-text-muted/60">{number}</span>
        
        {isSnake && (
          <div className="text-tiny font-bold text-error animate-pulse flex items-center gap-0.5">
            <Zap className="w-2.5 h-2.5" />
            {isSnake}
          </div>
        )}
        {isLadder && (
          <div className="text-tiny font-bold text-success animate-bounce flex items-center gap-0.5">
            <ArrowRightLeft className="w-2.5 h-2.5" />
            {isLadder}
          </div>
        )}

        <div className="flex gap-1 mt-2">
          {players.map(pIdx => (
            <div 
              key={pIdx}
              className={cn(
                "w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center shadow-hard border-2 border-surface -mt-1 scale-110",
                pIdx === 0 ? "bg-brand-500 text-text-inverted" : "bg-orange-500 text-text-inverted"
              )}
            >
              <UserIcon className="w-3 h-3 sm:w-4 sm:h-4" />
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderBoard = () => {
    const rows = [];
    for (let r = 9; r >= 0; r--) {
      const row = [];
      for (let c = 0; c < 10; c++) {
        const num = r % 2 === 0 ? (r * 10 + (c + 1)) : (r * 10 + (10 - c));
        row.push(renderCell(num));
      }
      rows.push(<div key={r} className="grid grid-cols-10 w-full">{row}</div>);
    }
    return rows;
  };

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-text-main flex items-center gap-2 tracking-tight">
            <Trophy className="w-7 h-7 text-yellow-500" />
            SNAKES & LADDERS
          </h2>
          <p className="text-sm font-medium text-text-muted">{message}</p>
        </div>
        <button 
          onClick={resetGame}
          className="p-2.5 bg-muted hover:bg-muted/80 rounded-xl transition-all"
        >
          <RotateCcw className="w-5 h-5 text-text-main" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Game Board */}
        <div className="lg:col-span-3">
          <div className="bg-surface rounded-2xl border-4 border-subtle shadow-hard overflow-hidden aspect-square">
            {renderBoard()}
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-6">
          <div className="bg-surface rounded-2xl border border-subtle p-6 shadow-soft space-y-6">
            <div className="flex justify-between">
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center border-2 transition-all",
                currentPlayer === 0 ? "bg-brand-500 border-brand-200 scale-110 shadow-soft shadow-brand-500/20" : "bg-muted border-transparent opacity-50"
              )}>
                <UserIcon className="w-6 h-6 text-text-inverted" />
              </div>
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center border-2 transition-all",
                currentPlayer === 1 ? "bg-orange-500 border-orange-200 scale-110 shadow-soft shadow-orange-500/20" : "bg-muted border-transparent opacity-50"
              )}>
                <UserIcon className="w-6 h-6 text-text-inverted" />
              </div>
            </div>

            <button
              onClick={rollDice}
              disabled={isRolling || message.includes("wins")}
              className={cn(
                "w-full aspect-square rounded-3xl flex flex-col items-center justify-center gap-4 transition-all group relative overflow-hidden",
                "bg-brand-500 hover:bg-brand-600 text-white shadow-xl shadow-brand-500/30",
                "disabled:opacity-50 disabled:bg-surface-400 disabled:shadow-none"
              )}
            >
              <div className={cn(
                "p-4 bg-white/20 rounded-2xl backdrop-blur-sm group-active:scale-90 transition-transform",
                isRolling && "animate-bounce"
              )}>
                <Dices className="w-12 h-12" />
              </div>
              <span className="font-black text-xl tracking-widest uppercase">
                {isRolling ? "Rolling..." : "Roll"}
              </span>
              
              {lastRoll && !isRolling && (
                <div className="absolute top-2 right-2 bg-white text-brand-600 w-8 h-8 rounded-full flex items-center justify-center font-black animate-in zoom-in duration-300">
                  {lastRoll}
                </div>
              )}
            </button>

            <div className="text-center space-y-1">
              <p className="text-tiny font-bold text-text-muted uppercase tracking-widest">Target</p>
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl font-black text-text-main">100</span>
                <Trophy className="w-5 h-5 text-yellow-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
