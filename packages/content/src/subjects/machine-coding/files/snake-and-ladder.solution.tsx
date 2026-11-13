import { useState } from "react";
import { Dices, RotateCcw } from "lucide-react";

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

const PLAYERS = [
  { name: "Player 1", token: "bg-brand-500" },
  { name: "Player 2", token: "bg-orange-500" },
];

// Rows from the top (91–100) down to the bottom (1–10). The bottom row runs left to right,
// the next right to left, and so on (boustrophedon).
const BOARD_ROWS = Array.from({ length: 10 }, (_, i) => {
  const r = 9 - i;
  const row = Array.from({ length: 10 }, (_, c) => r * 10 + c + 1);
  return r % 2 === 0 ? row : row.reverse();
});

export default function SnakeAndLadder() {
  const [positions, setPositions] = useState([0, 0]);
  const [current, setCurrent] = useState(0);
  const [winner, setWinner] = useState<number | null>(null);
  const [lastRoll, setLastRoll] = useState<number | null>(null);
  const [message, setMessage] = useState("Roll the dice to start.");

  const roll = () => {
    if (winner !== null) return;
    const dice = Math.floor(Math.random() * 6) + 1; // 1 to 6
    const player = PLAYERS[current].name;
    const from = positions[current];
    let to = from + dice;
    let msg = `${player} rolled ${dice}: ${from} → ${to}`;

    if (to > 100) {
      to = from; // you need the exact number to reach 100
      msg = `${player} rolled ${dice} and needs exactly ${100 - from}`;
    } else if (SNAKES[to]) {
      msg = `${player} rolled ${dice}. Snake: ${to} → ${SNAKES[to]}`;
      to = SNAKES[to];
    } else if (LADDERS[to]) {
      msg = `${player} rolled ${dice}. Ladder: ${to} → ${LADDERS[to]}`;
      to = LADDERS[to];
    }

    const newPositions = [...positions];
    newPositions[current] = to;
    setPositions(newPositions);
    setLastRoll(dice);

    if (to === 100) {
      setWinner(current);
      setMessage(`${player} wins.`);
    } else {
      setMessage(msg);
      setCurrent(current === 0 ? 1 : 0); // next player's turn
    }
  };

  const reset = () => {
    setPositions([0, 0]);
    setCurrent(0);
    setWinner(null);
    setLastRoll(null);
    setMessage("Roll the dice to start.");
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-text-main">Snakes and ladders</h2>
          <p aria-live="polite" className="text-sm text-text-muted">
            {message}
          </p>
        </div>
        <button onClick={reset} className="flex items-center gap-1.5 rounded-lg bg-muted px-3 py-2 text-sm font-semibold text-text-main hover:bg-border-subtle">
          <RotateCcw className="size-4" aria-hidden /> Reset
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_200px]">
        <div className="grid grid-cols-10 overflow-hidden rounded-xl border border-border-strong bg-surface">
          {BOARD_ROWS.flat().map((n) => {
            const snake = SNAKES[n];
            const ladder = LADDERS[n];
            const here: number[] = []; // which players are on this square
            positions.forEach((p, i) => {
              if (p === n) here.push(i);
            });
            return (
              <div
                key={n}
                className={`relative flex aspect-square flex-col items-center justify-center border border-border-subtle text-[10px] ${
                  snake ? "bg-error/10" : ladder ? "bg-success/10" : n % 2 ? "bg-surface" : "bg-muted"
                }`}
              >
                <span className="absolute top-0.5 left-1 text-text-muted">{n}</span>
                {snake && <span className="font-semibold text-error">↓{snake}</span>}
                {ladder && <span className="font-semibold text-success">↑{ladder}</span>}
                {here.length > 0 && (
                  <div className="flex gap-0.5">
                    {here.map((i) => (
                      <span key={i} className={`size-3 rounded-full border border-surface ${PLAYERS[i].token}`} title={PLAYERS[i].name} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="space-y-4">
          <ul className="space-y-2">
            {PLAYERS.map((p, i) => (
              <li
                key={p.name}
                className={`flex items-center justify-between rounded-lg border px-3 py-2 text-sm ${
                  winner === i ? "border-success bg-success/10" : current === i && winner === null ? "border-brand-500" : "border-border-subtle"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className={`size-3 rounded-full ${p.token}`} />
                  {p.name}
                </span>
                <span className="font-semibold">{positions[i]}</span>
              </li>
            ))}
          </ul>

          <button
            onClick={roll}
            disabled={winner !== null}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-500 py-3 font-semibold text-text-inverted hover:bg-brand-600 disabled:opacity-50"
          >
            <Dices className="size-5" aria-hidden />
            {winner !== null ? "Game over" : `Roll (${PLAYERS[current].name})`}
          </button>
          {lastRoll !== null && <p className="text-center text-sm text-text-muted">Last roll: {lastRoll}</p>}
        </div>
      </div>
    </div>
  );
}
