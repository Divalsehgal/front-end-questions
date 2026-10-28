import { useState, useRef, useEffect } from "react";

interface Item {
  id: number;
  label: string;
  checked: boolean;
}

const INITIAL_ITEMS: Item[] = [
  { id: 1, label: "Interactive Components", checked: false },
  { id: 2, label: "Tailwind v4 Styling", checked: true },
  { id: 3, label: "Base UI Primitives", checked: false },
  { id: 4, label: "TypeScript Safety", checked: false },
  { id: 5, label: "Performance Optimization", checked: false },
];

export default function AllCheckboxes() {
  const [items, setItems] = useState<Item[]>(INITIAL_ITEMS);
  const selectAllRef = useRef<HTMLInputElement>(null);

  // Parent state is derived from the children, never stored.
  const checkedCount = items.filter((i) => i.checked).length;
  const allChecked = checkedCount === items.length;
  const someChecked = checkedCount > 0 && !allChecked;

  // `indeterminate` is a DOM property with no HTML attribute, so set it via a ref.
  useEffect(() => {
    if (selectAllRef.current) selectAllRef.current.indeterminate = someChecked;
  }, [someChecked]);

  const toggleAll = () => {
    setItems((prev) => prev.map((item) => ({ ...item, checked: !allChecked })));
  };

  const toggleItem = (id: number) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  return (
    <div className="mx-auto max-w-md p-6">
      <div className="overflow-hidden rounded-2xl border border-border-subtle bg-surface">
        <div className="flex items-center justify-between border-b border-border-subtle bg-muted px-4 py-3">
          <label className="flex cursor-pointer items-center gap-3">
            <input
              ref={selectAllRef}
              type="checkbox"
              checked={allChecked}
              onChange={toggleAll}
              className="size-5 accent-brand-500"
            />
            <span className="font-semibold text-text-main">Select all</span>
          </label>
          <span className="text-sm text-text-muted" aria-live="polite">
            {checkedCount} of {items.length} selected
          </span>
        </div>

        <ul className="p-2">
          {items.map((item) => (
            <li key={item.id}>
              <label className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-muted">
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => toggleItem(item.id)}
                  className="size-5 accent-brand-500"
                />
                <span className={item.checked ? "text-text-main" : "text-text-muted"}>{item.label}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
