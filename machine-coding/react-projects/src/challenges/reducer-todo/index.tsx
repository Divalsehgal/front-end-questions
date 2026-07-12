import React, { useReducer, useState, memo, useCallback, useMemo } from "react";
import { cn } from "../../utils/cn";
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Trash2, 
  Plus, 
  Layout, 
  Blocks, 
  ArrowRight,
  ClipboardList
} from "lucide-react";
import { Select } from "@base-ui/react/select";

export const hint = "Comparative state management app showing useReducer vs useState patterns";

type Status = "Todo" | "Progress" | "Completed";

interface Todo {
  id: number;
  name: string;
  status: Status;
}

const INITIAL_DATA: Todo[] = [
  { id: 1, name: "Walk 5 miles", status: "Todo" },
  { id: 2, name: "Oil painting masterclass", status: "Completed" },
  { id: 3, name: "Public pool swimming", status: "Todo" },
  { id: 4, name: "Beef wellington dinner", status: "Progress" },
  { id: 5, name: "Deep clean office", status: "Progress" },
  { id: 6, name: "Coastal mountain drive", status: "Completed" },
];

const STATUS_CONFIG = {
  Todo: { icon: Circle, color: "text-text-muted", bg: "bg-muted" },
  Progress: { icon: Clock, color: "text-brand-500", bg: "bg-brand-500/10" },
  Completed: { icon: CheckCircle2, color: "text-success-500", bg: "bg-success-500/10" },
};

// --- Shared Components ---

const LineItem = memo(({ todo, onUpdate, onDelete }: { 
  todo: Todo; 
  onUpdate: (id: number, name: string, status: Status) => void; 
  onDelete: (id: number) => void 
}) => {
  const Icon = STATUS_CONFIG[todo.status].icon;

  return (
    <div className="group border-subtle animate-in fade-in slide-in-from-left-2 flex items-center justify-between rounded-2xl border bg-surface p-3 transition-all duration-300 hover:shadow-soft">
      <div className="flex min-w-0 items-center gap-3">
        <Icon className={cn("size-5 shrink-0", STATUS_CONFIG[todo.status].color)} />
        <span className={cn(
          "truncate text-sm font-medium",
          todo.status === "Completed" ? "text-text-muted line-through" : "text-text-main"
        )}>
          {todo.name}
        </span>
      </div>
      
      <div className="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
        <select 
          value={todo.status}
          onChange={(e) => onUpdate(todo.id, todo.name, e.target.value as Status)}
          className="text-tiny border-subtle rounded-lg border bg-muted px-2 py-1 font-black tracking-wider uppercase outline-none focus:ring-2 focus:ring-brand-500/20"
        >
          <option value="Todo">Todo</option>
          <option value="Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
        <button 
          onClick={() => onDelete(todo.id)}
          className="hover:text-error-500 hover:bg-error-500/10 rounded-lg p-1.5 text-text-muted transition-colors"
        >
          <Trash2 className="size-4" />
        </button>
      </div>
    </div>
  );
});

// --- useReducer Implementation ---

type TodoAction =
  | { type: "ADD"; payload: Todo }
  | { type: "DELETE"; payload: number }
  | { type: "UPDATE"; payload: Todo };

function TodoUseReducer() {
  const [todos, dispatch] = useReducer((state: Todo[], action: TodoAction) => {
    switch (action.type) {
      case "ADD": return [action.payload, ...state];
      case "DELETE": return state.filter((s) => s.id !== action.payload);
      case "UPDATE": return state.map((s) => (s.id === action.payload.id ? action.payload : s));
      default: return state;
    }
  }, INITIAL_DATA);

  const [input, setInput] = useState("");

  const handleAdd = useCallback(() => {
    if (!input.trim()) return;
    dispatch({ type: "ADD", payload: { id: Date.now(), name: input, status: "Todo" } });
    setInput("");
  }, [input]);

  return (
    <div className="space-y-6">
      <div className="border-subtle flex gap-2 rounded-2xl border bg-muted p-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder="New centralized task..."
          className="flex-1 border-none bg-transparent px-3 py-2 text-sm text-text-main outline-none"
        />
        <button 
          onClick={handleAdd}
          className="rounded-xl bg-brand-500 p-2 text-text-inverted shadow-soft transition-all hover:bg-brand-600 active:scale-95"
        >
          <Plus className="size-5" />
        </button>
      </div>
      <div className="space-y-2">
        {todos.map(t => (
          <LineItem 
            key={t.id} 
            todo={t} 
            onUpdate={(id, name, status) => dispatch({ type: "UPDATE", payload: { id, name, status } })}
            onDelete={(id) => dispatch({ type: "DELETE", payload: id })}
          />
        ))}
      </div>
    </div>
  );
}

// --- useState Implementation ---

function TodoUseState() {
  const [todos, setTodos] = useState<Todo[]>(INITIAL_DATA);
  const [input, setInput] = useState("");

  const handleAdd = useCallback(() => {
    if (!input.trim()) return;
    setTodos(prev => [{ id: Date.now(), name: input, status: "Todo" }, ...prev]);
    setInput("");
  }, [input]);

  const handleUpdate = useCallback((id: number, name: string, status: Status) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, name, status } : t));
  }, []);

  const handleDelete = useCallback((id: number) => {
    setTodos(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <div className="space-y-6">
      <div className="border-subtle flex gap-2 rounded-2xl border bg-muted p-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder="New atomic task..."
          className="flex-1 border-none bg-transparent px-3 py-2 text-sm text-text-main outline-none"
        />
        <button 
          onClick={handleAdd}
          className="bg-warning-500 hover:bg-warning-600 rounded-xl p-2 text-text-inverted shadow-soft transition-all active:scale-95"
        >
          <Plus className="size-5" />
        </button>
      </div>
      <div className="space-y-2">
        {todos.map(t => <LineItem key={t.id} todo={t} onUpdate={handleUpdate} onDelete={handleDelete} />)}
      </div>
    </div>
  );
}

// --- Main App ---

export default function ReducerTodo() {
  const [mode, setMode] = useState<"reducer" | "state">("reducer");

  return (
    <div className="mx-auto max-w-2xl space-y-8 p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="flex items-center gap-2 text-2xl font-black tracking-tight text-text-main uppercase">
            <ClipboardList className="size-7 text-brand-500" />
            STATE ARCHITECT
          </h2>
          <p className="text-sm font-medium text-text-muted">
            Compare <span className="font-black text-brand-500 underline decoration-2 underline-offset-4">Dispatch</span> vs <span className="text-warning-500 font-black underline decoration-2 underline-offset-4">Direct State</span> patterns.
          </p>
        </div>
      </div>

      <div className="border-subtle flex w-fit rounded-2xl border bg-muted p-1">
        <button
          onClick={() => setMode("reducer")}
          className={cn(
            "flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-bold transition-all",
            mode === "reducer" 
              ? "bg-surface text-brand-500 shadow-soft" 
              : "text-text-muted hover:text-text-main"
          )}
        >
          <Blocks className="size-4" />
          useReducer
        </button>
        <button
          onClick={() => setMode("state")}
          className={cn(
            "flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-bold transition-all",
            mode === "state" 
              ? "text-warning-500 bg-surface shadow-soft" 
              : "text-text-muted hover:text-text-main"
          )}
        >
          <Layout className="size-4" />
          useState
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_250px]">
        <div className="border-subtle rounded-3xl border bg-surface p-8 shadow-hard">
          {mode === "reducer" ? <TodoUseReducer /> : <TodoUseState />}
        </div>

        <div className="space-y-4">
          <div className="border-subtle space-y-3 rounded-3xl border bg-muted p-5">
            <h4 className="text-tiny font-black tracking-widest text-text-muted uppercase">Core Concepts</h4>
            <ul className="space-y-3">
              {[
                { label: "Dispatch Actions", color: "bg-brand-500" },
                { label: "State Reducers", color: "bg-brand-500" },
                { label: "Memoized Updates", color: "bg-success-500" },
              ].map((item, idx) => (
                <li key={idx} className="group flex cursor-help items-center gap-2">
                  <div className={cn("size-1.5 rounded-full transition-transform group-hover:scale-150", item.color)} />
                  <span className="text-tiny font-black text-text-muted uppercase transition-colors group-hover:text-text-main">{item.label}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="group relative overflow-hidden rounded-3xl bg-brand-500 p-6 text-text-inverted shadow-hard">
            <div className="absolute top-0 right-0 p-4 opacity-10 transition-transform group-hover:rotate-12">
              <ArrowRight className="size-12" />
            </div>
            <p className="text-tiny mb-2 font-black tracking-widest uppercase opacity-80">Verdict</p>
            <p className="text-sm leading-relaxed font-bold">
              Use <span className="font-black underline decoration-2">Reducer</span> for complex, multi-level state updates. Use <span className="font-black underline decoration-2">State</span> for simple, independent values.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
