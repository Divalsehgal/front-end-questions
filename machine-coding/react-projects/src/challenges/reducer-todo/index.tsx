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
  Todo: { icon: Circle, color: "text-gray-400", bg: "bg-surface-100" },
  Progress: { icon: Clock, color: "text-blue-500", bg: "bg-blue-100" },
  Completed: { icon: CheckCircle2, color: "text-green-500", bg: "bg-green-100" },
};

// --- Shared Components ---

const LineItem = memo(({ todo, onUpdate, onDelete }: { 
  todo: Todo; 
  onUpdate: (id: number, name: string, status: Status) => void; 
  onDelete: (id: number) => void 
}) => {
  const Icon = STATUS_CONFIG[todo.status].icon;

  return (
    <div className="group flex items-center justify-between p-3 bg-white dark:bg-surface-800 border border-surface-100 dark:border-surface-700/50 rounded-2xl hover:shadow-md transition-all animate-in fade-in slide-in-from-left-2 duration-300">
      <div className="flex items-center gap-3 min-w-0">
        <Icon className={cn("w-5 h-5 shrink-0", STATUS_CONFIG[todo.status].color)} />
        <span className={cn(
          "text-sm font-medium truncate",
          todo.status === "Completed" ? "text-gray-400 line-through" : "text-gray-900 dark:text-gray-100"
        )}>
          {todo.name}
        </span>
      </div>
      
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <select 
          value={todo.status}
          onChange={(e) => onUpdate(todo.id, todo.name, e.target.value as Status)}
          className="text-[10px] font-bold uppercase tracking-wider bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-brand-500/20"
        >
          <option value="Todo">Todo</option>
          <option value="Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
        <button 
          onClick={() => onDelete(todo.id)}
          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
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
      <div className="flex gap-2 p-2 bg-surface-50 dark:bg-surface-900/50 rounded-2xl border border-surface-200 dark:border-surface-800">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder="New centralized task..."
          className="flex-1 bg-transparent border-none outline-none px-3 text-sm py-2 text-gray-900 dark:text-white"
        />
        <button 
          onClick={handleAdd}
          className="p-2 bg-brand-500 text-white rounded-xl shadow-lg shadow-brand-500/20 hover:bg-brand-600 active:scale-95 transition-all"
        >
          <Plus className="w-5 h-5" />
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
      <div className="flex gap-2 p-2 bg-surface-50 dark:bg-surface-900/50 rounded-2xl border border-surface-200 dark:border-surface-800">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder="New atomic task..."
          className="flex-1 bg-transparent border-none outline-none px-3 text-sm py-2 text-gray-900 dark:text-white"
        />
        <button 
          onClick={handleAdd}
          className="p-2 bg-orange-500 text-white rounded-xl shadow-lg shadow-orange-500/20 hover:bg-orange-600 active:scale-95 transition-all"
        >
          <Plus className="w-5 h-5" />
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
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2 tracking-tight uppercase">
            <ClipboardList className="w-7 h-7 text-brand-500" />
            STATE ARCHITECT
          </h2>
          <p className="text-sm font-medium text-gray-500">
            Compare <span className="text-brand-500 underline decoration-2 underline-offset-4">Dispatch</span> vs <span className="text-orange-500 underline decoration-2 underline-offset-4">Direct State</span> patterns.
          </p>
        </div>
      </div>

      <div className="flex p-1 bg-surface-100 dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 w-fit">
        <button
          onClick={() => setMode("reducer")}
          className={cn(
            "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all",
            mode === "reducer" 
              ? "bg-white dark:bg-surface-700 text-brand-600 shadow-sm" 
              : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
          )}
        >
          <Blocks className="w-4 h-4" />
          useReducer
        </button>
        <button
          onClick={() => setMode("state")}
          className={cn(
            "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all",
            mode === "state" 
              ? "bg-white dark:bg-surface-700 text-orange-600 shadow-sm" 
              : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
          )}
        >
          <Layout className="w-4 h-4" />
          useState
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_250px] gap-8">
        <div className="bg-white dark:bg-surface-900 p-8 rounded-[2.5rem] border border-surface-100 dark:border-surface-800 shadow-2xl">
          {mode === "reducer" ? <TodoUseReducer /> : <TodoUseState />}
        </div>

        <div className="space-y-4">
          <div className="p-5 bg-surface-50 dark:bg-surface-900/50 rounded-3xl border border-surface-200 dark:border-surface-800 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-gray-400">Core Concepts</h4>
            <ul className="space-y-3">
              {[
                { label: "Dispatch Actions", color: "bg-brand-500" },
                { label: "State Reducers", color: "bg-blue-500" },
                { label: "Memoized Updates", color: "bg-green-500" },
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-2 group cursor-help">
                  <div className={cn("w-1.5 h-1.5 rounded-full transition-transform group-hover:scale-150", item.color)} />
                  <span className="text-xs font-bold text-gray-600 dark:text-gray-300">{item.label}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="p-5 bg-brand-500 p-6 rounded-3xl text-white shadow-xl shadow-brand-500/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
              <ArrowRight className="w-12 h-12" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-2">Verdict</p>
            <p className="text-xs font-bold leading-relaxed">
              Use <span className="underline">Reducer</span> for complex, multi-level state updates. Use <span className="underline">State</span> for simple, independent values.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
