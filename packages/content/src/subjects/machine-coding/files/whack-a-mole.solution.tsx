import { useState, useEffect } from "react";

const HOLES = 9;
const GAME_SECONDS = 15;
const SPAWN_MS = 1000;
const VISIBLE_MS = 700; // shorter than SPAWN_MS so moles never stack

export default function WhackAMole() {
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(GAME_SECONDS);
  const [score, setScore] = useState(0);
  const [mole, setMole] = useState<number | null>(null);

  // Derived: the game runs until the countdown hits zero.
  const running = started && timeLeft > 0;

  // Everything time-based lives in one effect keyed on `running`, so it is set
  // up once per game and torn down when time runs out or on unmount.
  useEffect(() => {
    if (!running) return;
    let hideTimeout: ReturnType<typeof setTimeout> | undefined;

    const countdown = setInterval(() => setTimeLeft((t) => Math.max(t - 1, 0)), 1000);

    const spawner = setInterval(() => {
      clearTimeout(hideTimeout);
      setMole(Math.floor(Math.random() * HOLES));
      hideTimeout = setTimeout(() => setMole(null), VISIBLE_MS);
    }, SPAWN_MS);

    return () => {
      clearInterval(countdown);
      clearInterval(spawner);
      clearTimeout(hideTimeout);
      setMole(null);
    };
  }, [running]);

  const whack = (index: number) => {
    if (!running || mole !== index) return;
    setScore((s) => s + 1);
    setMole(null);
  };

  const restart = () => {
    setScore(0);
    setTimeLeft(GAME_SECONDS);
    setMole(null);
    setStarted(true);
  };

  return (
    <div className="mx-auto max-w-md space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-main">Whack-a-mole</h2>
          <p className="text-sm text-text-muted" aria-live="polite">
            Time left: {timeLeft}s · Score: {score}
          </p>
        </div>
        <button
          type="button"
          onClick={restart}
          className="rounded-lg bg-brand-500 px-4 py-2 font-semibold text-white transition-colors hover:bg-brand-600"
        >
          {!started ? "Start" : running ? "Restart" : "Play again"}
        </button>
      </div>

      {started && !running && (
        <p className="rounded-lg bg-muted p-3 text-center font-semibold text-text-main">
          Time's up. Final score: {score}
        </p>
      )}

      <div className="grid grid-cols-3 gap-3">
        {Array.from({ length: HOLES }, (_, i) => {
          const visible = running && mole === i;
          return (
            <button
              key={i}
              type="button"
              onClick={() => whack(i)}
              aria-label={visible ? `Mole in hole ${i + 1}` : `Empty hole ${i + 1}`}
              className="relative flex aspect-square items-end justify-center overflow-hidden rounded-2xl bg-green-200"
            >
              {/* Mole: a simple drawn head that rises out of the hole. */}
              <span
                aria-hidden="true"
                className={
                  "absolute bottom-4 flex size-16 flex-col items-center justify-start rounded-t-full bg-amber-800 pt-4 transition-transform duration-150 " +
                  (visible ? "translate-y-0" : "translate-y-full")
                }
              >
                <span className="flex gap-3">
                  <span className="size-2 rounded-full bg-black" />
                  <span className="size-2 rounded-full bg-black" />
                </span>
                <span className="mt-1 h-2 w-3 rounded-full bg-pink-300" />
              </span>
              {/* Hole drawn on top so the mole appears to come out of it. */}
              <span aria-hidden="true" className="relative mb-2 h-6 w-4/5 rounded-[50%] bg-stone-800" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
