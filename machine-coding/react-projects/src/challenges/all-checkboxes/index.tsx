import { useState, useMemo } from "react";
import { cn } from "../../utils/cn";
import { Check } from "lucide-react";
import { Checkbox } from "@base-ui/react/checkbox";

export const hint =
  "Toggling one item is simple selection making it checked and toggling all means setting inverse of all checked";

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

  const allChecked = useMemo(() => items.every((i) => i.checked), [items]);

  const someChecked = useMemo(
    () => items.some((i) => i.checked) && !allChecked,
    [items],
  );

  const toggleAll = () => {
    setItems((prev) => {
      return prev.map((m) => {
        return {
          ...m,
          checked: !allChecked,
        };
      });
    });
  };

  const toggleItem = (id: number) => {
    setItems((prev) => {
      return prev.map((m) => {
        if (m.id === id) {
          return {
            ...m,
            checked: !m.checked,
          };
        } else {
          return m;
        }
      });
    });
  };

  return (
    <div className="mx-auto max-w-md space-y-8 p-6">
      <div className="border-subtle overflow-hidden rounded-3xl border bg-surface shadow-hard">
        <div className="border-subtle border-b bg-muted p-4">
          <label className="dark:hover:bg-surface-800 group flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2 transition-all hover:bg-white">
            <Checkbox.Root
              checked={allChecked}
              indeterminate={someChecked}
              onCheckedChange={toggleAll}
              className={cn(
                "flex size-6 shrink-0 items-center justify-center rounded-lg border-2 transition-all",
                allChecked || someChecked
                  ? "border-brand-500 bg-brand-500 text-text-inverted"
                  : "border-strong bg-transparent group-hover:border-brand-500",
              )}
            >
              <Checkbox.Indicator>
                {allChecked ? (
                  <Check className="size-4" strokeWidth={3} />
                ) : (
                  <div className="h-0.5 w-2.5 rounded-full bg-text-inverted" />
                )}
              </Checkbox.Indicator>
            </Checkbox.Root>
            <span className="text-xs font-bold tracking-wider text-text-main uppercase">
              Select All Components
            </span>
          </label>
        </div>

        {/* List Items */}
        <div className="space-y-1 p-4">
          {items.map((item) => (
            <label
              key={item.id}
              className={cn(
                "group mb-1 flex cursor-pointer items-center gap-3 rounded-xl p-3 transition-all",
                item.checked ? "bg-brand-500/10" : "hover:bg-muted",
              )}
            >
              <Checkbox.Root
                checked={item.checked}
                onCheckedChange={() => toggleItem(item.id)}
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-lg border-2 transition-all",
                  item.checked
                    ? "border-brand-500 bg-brand-500 text-text-inverted shadow-soft shadow-brand-500/20"
                    : "border-subtle bg-transparent group-hover:border-brand-500",
                )}
              >
                <Checkbox.Indicator>
                  <Check className="size-4" strokeWidth={3} />
                </Checkbox.Indicator>
              </Checkbox.Root>
              <span
                className={cn(
                  "text-sm font-medium transition-colors",
                  item.checked ? "text-text-main" : "text-text-muted",
                )}
              >
                {item.label}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
