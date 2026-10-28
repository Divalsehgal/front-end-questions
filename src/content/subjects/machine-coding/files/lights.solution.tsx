import { useState } from 'react';

const GRID_SIZE = 5;

// Array.from with a function makes a NEW row each time. Array(5).fill(row) would share one row.
const createGrid = () => Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(false));

export default function Lights() {
  const [grid, setGrid] = useState<boolean[][]>(createGrid);

  const setCell = (r: number, c: number, value: boolean) => {
    // Functional update: each timer works on the latest grid, not the one from when it started.
    setGrid((prev) => prev.map((row, i) => row.map((on, j) => (i === r && j === c ? value : on))));
  };

  const activateCell = (r: number, c: number) => {
    setCell(r, c, true);
    setTimeout(() => setCell(r, c, false), 1000);
  };

  return (
    <div className="mx-auto max-w-md space-y-4 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-text-main">Lights</h2>
        <button onClick={() => setGrid(createGrid())} className="rounded-lg bg-muted px-3 py-1.5 text-sm text-text-main">
          Reset
        </button>
      </div>

      <div className="grid aspect-square grid-cols-5 gap-3">
        {grid.map((row, r) =>
          row.map((isOn, c) => (
            <button
              key={`${r}-${c}`}
              aria-label={`Cell ${r + 1}, ${c + 1}`}
              onClick={() => activateCell(r, c)}
              className={`rounded-xl border-2 transition-colors duration-300 ${
                isOn ? 'border-warning-500 bg-warning-500' : 'border-border-subtle bg-muted'
              }`}
            />
          )),
        )}
      </div>
    </div>
  );
}
