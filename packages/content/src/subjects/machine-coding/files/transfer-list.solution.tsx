import { useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface Item {
  id: number;
  label: string;
}

const INITIAL_LEFT: Item[] = [
  { id: 1, label: "React Native" },
  { id: 2, label: "TypeScript" },
  { id: 3, label: "Node.js" },
  { id: 4, label: "Vite" },
  { id: 5, label: "Base UI" },
];

const INITIAL_RIGHT: Item[] = [
  { id: 6, label: "Tailwind v4" },
  { id: 7, label: "Next.js" },
];

// Ids follow the starting order, so sorting by id after a move keeps items in their original order.
const byId = (a: Item, b: Item) => a.id - b.id;

export default function TransferList() {
  const [left, setLeft] = useState<Item[]>(INITIAL_LEFT);
  const [right, setRight] = useState<Item[]>(INITIAL_RIGHT);
  const [selected, setSelected] = useState<number[]>([]); // ids are unique across both lists

  const toggle = (id: number) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const moveRight = () => {
    const toMove = left.filter((item) => selected.includes(item.id));
    setRight((prev) => [...prev, ...toMove].sort(byId));
    setLeft((prev) => prev.filter((item) => !selected.includes(item.id)));
    setSelected([]);
  };

  const moveLeft = () => {
    const toMove = right.filter((item) => selected.includes(item.id));
    setLeft((prev) => [...prev, ...toMove].sort(byId));
    setRight((prev) => prev.filter((item) => !selected.includes(item.id)));
    setSelected([]);
  };

  const moveAllRight = () => {
    setRight((prev) => [...prev, ...left].sort(byId));
    setLeft([]);
    setSelected([]);
  };

  const moveAllLeft = () => {
    setLeft((prev) => [...prev, ...right].sort(byId));
    setRight([]);
    setSelected([]);
  };

  const leftHasSelected = left.some((item) => selected.includes(item.id));
  const rightHasSelected = right.some((item) => selected.includes(item.id));

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-text-main">Transfer list</h2>
        <p className="text-sm text-text-muted">Move items between the two lists.</p>
      </div>

      <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-[1fr_auto_1fr]">
        <ListPanel title="Available" items={left} selected={selected} onToggle={toggle} />

        <div className="flex justify-center gap-2 md:flex-col">
          <ControlButton label="Move selected right" disabled={!leftHasSelected} onClick={moveRight}>
            <ChevronRight className="size-5" />
          </ControlButton>
          <ControlButton label="Move all right" disabled={left.length === 0} onClick={moveAllRight}>
            <ChevronsRight className="size-5" />
          </ControlButton>
          <ControlButton label="Move selected left" disabled={!rightHasSelected} onClick={moveLeft}>
            <ChevronLeft className="size-5" />
          </ControlButton>
          <ControlButton label="Move all left" disabled={right.length === 0} onClick={moveAllLeft}>
            <ChevronsLeft className="size-5" />
          </ControlButton>
        </div>

        <ListPanel title="Selected" items={right} selected={selected} onToggle={toggle} />
      </div>
    </div>
  );
}

function ListPanel({
  title,
  items,
  selected,
  onToggle,
}: Readonly<{ title: string; items: Item[]; selected: number[]; onToggle: (id: number) => void }>) {
  return (
    <section className="flex h-80 flex-col overflow-hidden rounded-2xl border border-border-subtle bg-surface">
      <header className="flex items-center justify-between border-b border-border-subtle bg-muted px-4 py-3">
        <h3 className="text-sm font-semibold text-text-main">{title}</h3>
        <span className="text-xs text-text-muted">
          {items.length} items
        </span>
      </header>
      {items.length === 0 ? (
        <p className="flex flex-1 items-center justify-center text-sm text-text-muted">No items</p>
      ) : (
        <ul className="flex-1 space-y-1 overflow-y-auto p-2">
          {items.map((item) => (
            <li key={item.id}>
              <label className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm text-text-main hover:bg-muted has-checked:bg-brand-50">
                <input
                  type="checkbox"
                  checked={selected.includes(item.id)}
                  onChange={() => onToggle(item.id)}
                  className="size-4 accent-brand-500"
                />
                {item.label}
              </label>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function ControlButton({
  label,
  disabled,
  onClick,
  children,
}: Readonly<{ label: string; disabled: boolean; onClick: () => void; children: ReactNode }>) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className="rounded-xl border border-border-subtle bg-surface p-2.5 text-brand-500 hover:bg-brand-500 hover:text-text-inverted disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-surface disabled:hover:text-brand-500"
    >
      {children}
    </button>
  );
}
