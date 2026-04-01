import { useReducer, useState, memo, useCallback, useMemo } from "react";

type Status = "Completed" | "Progress" | "Todo";
type Todos = {
    id: number;
    name: string;
    status: Status
}
const DATA: Todos[] = [
    { id: 1, name: "Walking", status: 'Todo' },
    { id: 2, name: "Painting", status: "Completed" },
    { id: 3, name: "Swimming", status: "Todo" },
    { id: 4, name: "Cooking", status: "Progress" },
    { id: 5, name: "Cleaning", status: "Progress" },
    { id: 6, name: "Driving", status: "Completed" }
]

type TypeLineItemShared = Todos & {
    onUpdate: (id: number, name: string, status: Status) => void;
    onDelete: (id: number) => void;
}

const LineItem = memo(({ id, name, status, onUpdate, onDelete }: TypeLineItemShared) => {
    return (
        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
            <span style={{ minWidth: '100px' }}>{name}</span>
            <select
                value={status}
                onChange={(e) => onUpdate(id, name, e.target.value as Status)}
            >
                <option value="Todo">Todo</option>
                <option value="Progress">Progress</option>
                <option value="Completed">Completed</option>
            </select>
            <button onClick={() => onDelete(id)}>Delete</button>
        </div>
    )
})

type TodoAction =
    | { type: 'ADD'; payload: Todos }
    | { type: 'DELETE'; payload: number }
    | { type: 'UPDATE'; payload: Todos };

const TodoUseReducer = () => {

    const [todos, dispatch] = useReducer((state: Todos[], action: TodoAction) => {
        switch (action.type) {
            case 'ADD':
                return [...state, action.payload];
            case "DELETE":
                return state.filter((s) => s.id !== action.payload)
            case "UPDATE":
                return state.map((s) => {
                    if (s.id === action.payload.id) {
                        return action.payload
                    }
                    return s;
                })
            default:
                return state;
        }
    }, DATA)

    const [newTaskName, setNewTaskName] = useState("");

    const handleAdd = useCallback(() => {
        if (!newTaskName.trim()) return;
        dispatch({
            type: 'ADD',
            payload: { id: Date.now(), name: newTaskName, status: 'Todo' }
        });
        setNewTaskName("");
    }, [newTaskName])

    const handleUpdate = useCallback((id: number, name: string, status: Status) => {
        dispatch({ type: 'UPDATE', payload: { id, name, status } });
    }, [])

    const handleDelete = useCallback((id: number) => {
        dispatch({ type: 'DELETE', payload: id });
    }, [])

    return (
        <div style={{ border: '1px solid #ccc', padding: '16px', borderRadius: '8px' }}>
            <h3>Todo App (useReducer)</h3>
            <div style={{ marginBottom: '20px', display: 'flex', gap: '8px' }}>
                <input
                    type="text"
                    value={newTaskName}
                    onChange={(e) => setNewTaskName(e.target.value)}
                    placeholder="Enter new task..."
                    style={{ padding: '4px 8px' }}
                />
                <button onClick={handleAdd}>Add Task</button>
            </div>
            <div>
                {todos.map((d) => (
                    <LineItem key={d.id} {...d} onUpdate={handleUpdate} onDelete={handleDelete} />
                ))}
            </div>
        </div>
    )
}

const TodoUseState = () => {
    const [todos, setTodos] = useState<Todos[]>(DATA);
    const [newTaskName, setNewTaskName] = useState("");

    const handleAdd = useCallback(() => {
        if (!newTaskName.trim()) return;
        setTodos(prev => [...prev, {
            id: Date.now(),
            name: newTaskName,
            status: 'Todo'
        }]);
        setNewTaskName("");
    }, [newTaskName])

    const handleUpdate = useCallback((id: number, name: string, status: Status) => {
        setTodos(prev => prev.map(t => t.id === id ? { ...t, name, status } : t));
    }, [])

    const handleDelete = useCallback((id: number) => {
        setTodos(prev => prev.filter(t => t.id !== id));
    }, [])

    return (
        <div style={{ border: '1px solid #ccc', padding: '16px', borderRadius: '8px' }}>
            <h3>Todo App (useState)</h3>
            <div style={{ marginBottom: '20px', display: 'flex', gap: '8px' }}>
                <input
                    type="text"
                    value={newTaskName}
                    onChange={(e) => setNewTaskName(e.target.value)}
                    placeholder="Enter new task..."
                    style={{ padding: '4px 8px' }}
                />
                <button onClick={handleAdd}>Add Task</button>
            </div>
            <div>
                {todos.map((d) => (
                    <LineItem key={d.id} {...d} onUpdate={handleUpdate} onDelete={handleDelete} />
                ))}
            </div>
        </div>
    )
}

const ToggleApp = () => {
    const [useReducerMode, setUseReducerMode] = useState(true);

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <h2>State Management Demo</h2>
            <div style={{ marginBottom: '20px', display: 'flex', gap: '8px' }}>
                <button
                    onClick={() => setUseReducerMode(true)}
                    style={{ fontWeight: useReducerMode ? 'bold' : 'normal', padding: '6px 12px' }}
                >
                    Show useReducer approach
                </button>
                <button
                    onClick={() => setUseReducerMode(false)}
                    style={{ fontWeight: !useReducerMode ? 'bold' : 'normal', padding: '6px 12px' }}
                >
                    Show useState approach
                </button>
            </div>

            {useReducerMode ? <TodoUseReducer /> : <TodoUseState />}
        </div>
    )
}

export default ToggleApp;