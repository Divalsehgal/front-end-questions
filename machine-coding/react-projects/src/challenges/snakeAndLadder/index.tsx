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
          "border-surface-200 dark:border-surface-700/50 relative flex h-12 w-full flex-col items-center justify-center border transition-all sm:h-16",
          (number % 2 === 0) ? "bg-muted/30" : "bg-surface/30",
          isSnake && "bg-error/10",
          isLadder && "bg-success/10"
        )}
      >
        <span className="text-tiny absolute top-1 left-1 font-bold text-text-muted/60">{number}</span>
        
        {isSnake && (
          <div className="text-tiny flex animate-pulse items-center gap-0.5 font-bold text-error">
            <Zap className="size-2.5" />
            {isSnake}
          </div>
        )}
        {isLadder && (
          <div className="text-tiny flex animate-bounce items-center gap-0.5 font-bold text-success">
            <ArrowRightLeft className="size-2.5" />
            {isLadder}
          </div>
        )}

        <div className="mt-2 flex gap-1">
          {players.map(pIdx => (
            <div 
              key={pIdx}
              className={cn(
                "-mt-1 flex size-5 scale-110 items-center justify-center rounded-full border-2 border-surface shadow-hard sm:size-6",
                pIdx === 0 ? "bg-brand-500 text-text-inverted" : "bg-orange-500 text-text-inverted"
              )}
            >
              <UserIcon className="size-3 sm:size-4" />
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
      rows.push(<div key={r} className="grid w-full grid-cols-10">{row}</div>);
    }
    return rows;
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8 p-4 sm:p-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="flex items-center gap-2 text-2xl font-black tracking-tight text-text-main">
            <Trophy className="size-7 text-yellow-500" />
            SNAKES & LADDERS
          </h2>
          <p className="text-sm font-medium text-text-muted">{message}</p>
        </div>
        <button 
          onClick={resetGame}
          className="rounded-xl bg-muted p-2.5 transition-all hover:bg-muted/80"
        >
          <RotateCcw className="size-5 text-text-main" />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Game Board */}
        <div className="lg:col-span-3">
          <div className="border-subtle aspect-square overflow-hidden rounded-2xl border-4 bg-surface shadow-hard">
            {renderBoard()}
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-6">
          <div className="border-subtle space-y-6 rounded-2xl border bg-surface p-6 shadow-soft">
            <div className="flex justify-between">
              <div className={cn(
                "flex size-12 items-center justify-center rounded-xl border-2 transition-all",
                currentPlayer === 0 ? "scale-110 border-brand-200 bg-brand-500 shadow-soft shadow-brand-500/20" : "border-transparent bg-muted opacity-50"
              )}>
                <UserIcon className="size-6 text-text-inverted" />
              </div>
              <div className={cn(
                "flex size-12 items-center justify-center rounded-xl border-2 transition-all",
                currentPlayer === 1 ? "scale-110 border-orange-200 bg-orange-500 shadow-soft shadow-orange-500/20" : "border-transparent bg-muted opacity-50"
              )}>
                <UserIcon className="size-6 text-text-inverted" />
              </div>
            </div>

            <button
              onClick={rollDice}
              disabled={isRolling || message.includes("wins")}
              className={cn(
                "group relative flex aspect-square w-full flex-col items-center justify-center gap-4 overflow-hidden rounded-3xl transition-all",
                "bg-brand-500 text-white shadow-xl shadow-brand-500/30 hover:bg-brand-600",
                "disabled:bg-surface-400 disabled:opacity-50 disabled:shadow-none"
              )}
            >
              <div className={cn(
                "rounded-2xl bg-white/20 p-4 backdrop-blur-sm transition-transform group-active:scale-90",
                isRolling && "animate-bounce"
              )}>
                <Dices className="size-12" />
              </div>
              <span className="text-xl font-black tracking-widest uppercase">
                {isRolling ? "Rolling..." : "Roll"}
              </span>
              
              {lastRoll && !isRolling && (
                <div className="animate-in zoom-in absolute top-2 right-2 flex size-8 items-center justify-center rounded-full bg-white font-black text-brand-600 duration-300">
                  {lastRoll}
                </div>
              )}
            </button>

            <div className="space-y-1 text-center">
              <p className="text-tiny font-bold tracking-widest text-text-muted uppercase">Target</p>
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl font-black text-text-main">100</span>
                <Trophy className="size-5 text-yellow-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
