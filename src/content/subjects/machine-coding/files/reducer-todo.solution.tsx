import { memo, useCallback, useReducer, useState } from "react";
import { CheckCircle2, Circle, Clock, Plus, Trash2 } from "lucide-react";

type Status = "Todo" | "Progress" | "Completed";

interface Todo {
  id: number;
  name: string;
  status: Status;
}

const INITIAL_DATA: Todo[] = [
  { id: 1, name: "Walk 5 miles", status: "Todo" },
  { id: 2, name: "Oil painting class", status: "Completed" },
  { id: 3, name: "Public pool swimming", status: "Todo" },
  { id: 4, name: "Beef wellington dinner", status: "Progress" },
  { id: 5, name: "Deep clean office", status: "Progress" },
  { id: 6, name: "Coastal mountain drive", status: "Completed" },
];

const STATUS_ICON = {
  Todo: { icon: Circle, color: "text-text-muted" },
  Progress: { icon: Clock, color: "text-brand-500" },
  Completed: { icon: CheckCircle2, color: "text-success" },
} as const;

// --- Shared row ---

type RowProps = {
  todo: Todo;
  onStatusChange: (id: number, status: Status) => void;
  onDelete: (id: number) => void;
};

// memo + stable callbacks: changing one todo re-renders only that row.
const LineItem = memo(function LineItem({ todo, onStatusChange, onDelete }: RowProps) {
  const { icon: Icon, color } = STATUS_ICON[todo.status];

  return (
    <li className="flex items-center justify-between gap-3 rounded-xl border border-border-subtle bg-surface p-3">
      <div className="flex min-w-0 items-center gap-3">
        <Icon className={`size-5 shrink-0 ${color}`} aria-hidden />
        <span className={`truncate text-sm ${todo.status === "Completed" ? "text-text-muted line-through" : "text-text-main"}`}>
          {todo.name}
        </span>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <select
          value={todo.status}
          onChange={(e) => onStatusChange(todo.id, e.target.value as Status)}
          aria-label={`Status of ${todo.name}`}
          className="rounded-lg border border-border-subtle bg-muted px-2 py-1 text-xs outline-none focus:border-brand-500"
        >
          <option value="Todo">Todo</option>
          <option value="Progress">In progress</option>
          <option value="Completed">Completed</option>
        </select>
        <button
          onClick={() => onDelete(todo.id)}
          aria-label={`Delete ${todo.name}`}
          className="rounded-lg p-1.5 text-text-muted hover:bg-error/10 hover:text-error"
        >
          <Trash2 className="size-4" aria-hidden />
        </button>
      </div>
    </li>
  );
});

function AddTodo({ onAdd }: Readonly<{ onAdd: (name: string) => void }>) {
  const [input, setInput] = useState("");
  const submit = () => {
    const name = input.trim();
    if (!name) return; // empty input is ignored
    onAdd(name);
    setInput("");
  };

  return (
    <div className="flex gap-2 rounded-xl border border-border-subtle bg-muted p-1.5">
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        placeholder="New task…"
        aria-label="New task"
        className="flex-1 bg-transparent px-3 py-2 text-sm text-text-main outline-none"
      />
      <button onClick={submit} aria-label="Add task" className="rounded-lg bg-brand-500 p-2 text-text-inverted hover:bg-brand-600">
        <Plus className="size-5" aria-hidden />
      </button>
    </div>
  );
}

// --- useReducer version ---

type TodoAction =
  | { type: "ADD"; name: string }
  | { type: "UPDATE"; id: number; status: Status }
  | { type: "DELETE"; id: number };

// Pure: same state + action always gives the same result, so it is trivial to unit test.
function todoReducer(state: Todo[], action: TodoAction): Todo[] {
  switch (action.type) {
    case "ADD":
      return [{ id: Date.now(), name: action.name, status: "Todo" }, ...state];
    case "UPDATE":
      return state.map((t) => (t.id === action.id ? { ...t, status: action.status } : t));
    case "DELETE":
      return state.filter((t) => t.id !== action.id);
  }
}

function TodoUseReducer() {
  const [todos, dispatch] = useReducer(todoReducer, INITIAL_DATA);

  // dispatch is stable for the component's lifetime, so these never change identity.
  const onStatusChange = useCallback((id: number, status: Status) => dispatch({ type: "UPDATE", id, status }), []);
  const onDelete = useCallback((id: number) => dispatch({ type: "DELETE", id }), []);
  const onAdd = useCallback((name: string) => dispatch({ type: "ADD", name }), []);

  return (
    <div className="space-y-4">
      <AddTodo onAdd={onAdd} />
      <ul className="space-y-2">
        {todos.map((t) => (
          <LineItem key={t.id} todo={t} onStatusChange={onStatusChange} onDelete={onDelete} />
        ))}
      </ul>
    </div>
  );
}

// --- useState version ---

function TodoUseState() {
  const [todos, setTodos] = useState<Todo[]>(INITIAL_DATA);

  const onAdd = useCallback((name: string) => {
    setTodos((prev) => [{ id: Date.now(), name, status: "Todo" }, ...prev]);
  }, []);
  const onStatusChange = useCallback((id: number, status: Status) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
  }, []);
  const onDelete = useCallback((id: number) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <div className="space-y-4">
      <AddTodo onAdd={onAdd} />
      <ul className="space-y-2">
        {todos.map((t) => (
          <LineItem key={t.id} todo={t} onStatusChange={onStatusChange} onDelete={onDelete} />
        ))}
      </ul>
    </div>
  );
}

// --- App ---

export default function ReducerTodo() {
  const [mode, setMode] = useState<"reducer" | "state">("reducer");

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <h2 className="text-2xl font-bold text-text-main">Todos: useReducer vs useState</h2>

      <div role="tablist" className="flex w-fit rounded-xl border border-border-subtle bg-muted p-1">
        {(["reducer", "state"] as const).map((m) => (
          <button
            key={m}
            role="tab"
            aria-selected={mode === m}
            onClick={() => setMode(m)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold ${
              mode === m ? "bg-surface text-brand-600 shadow-soft" : "text-text-muted hover:text-text-main"
            }`}
          >
            {m === "reducer" ? "useReducer" : "useState"}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_260px]">
        <div className="rounded-2xl border border-border-subtle bg-surface p-5">
          {mode === "reducer" ? <TodoUseReducer /> : <TodoUseState />}
        </div>

        <aside className="space-y-2 rounded-2xl border border-border-subtle bg-muted p-5 text-sm text-text-main">
          <h3 className="font-semibold">When to use which</h3>
          <p>
            <strong>useReducer</strong> when several actions update the same state, when the next state depends on the
            previous one in non-trivial ways, or when you want the update logic in one pure, testable function. Its{' '}
            <code>dispatch</code> is stable, which makes memoised children easy.
          </p>
          <p>
            <strong>useState</strong> for simple, independent values (a toggle, an input) where a reducer would only add
            ceremony.
          </p>
        </aside>
      </div>
    </div>
  );
}
