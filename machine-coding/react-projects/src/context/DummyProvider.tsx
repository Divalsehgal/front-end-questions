import { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";

type ValueType = {
    id: number;
    name: string;
    age: number;
}

interface DummyStateContextType {
    value: ValueType;
}

interface DummyActionContextType {
    setValue: React.Dispatch<React.SetStateAction<ValueType>>
}

// Separate Contexts for State and Actions
export const DummyStateContext = createContext<DummyStateContextType | undefined>(undefined)
export const DummyActionContext = createContext<DummyActionContextType | undefined>(undefined)

type ChildrenProp = {
    children: React.ReactNode
}

export const DummyProvider = ({ children }: ChildrenProp) => {
    const [value, setValue] = useState<ValueType>(() => {
        const savedData = localStorage.getItem('name');
        if (savedData) {
            try {
                return JSON.parse(savedData);
            } catch (e) {
                console.error("Failed to parse 'name' from localStorage", e);
            }
        }
        return {
            id: 1,
            name: "Dival",
            age: 29
        };
    })

    // Actions Context Value - stable reference
    const actions = useMemo(() => ({
        setValue
    }), [setValue]);

    // State Context Value - changes when state changes
    const state = useMemo(() => ({
        value
    }), [value]);

    useEffect(() => {
        console.log("Rendering DummyProvider (Container)")
    }, [])

    return (
        <DummyActionContext.Provider value={actions}>
            <DummyStateContext.Provider value={state}>
                {children}
            </DummyStateContext.Provider>
        </DummyActionContext.Provider>
    )
}

// Hook for reading state
export const useDummyState = () => {
    const context = useContext(DummyStateContext)
    if (context === undefined) {
        throw new Error("useDummyState must be used within a DummyProvider");
    }
    return context
}

// Hook for actions
export const useDummyActions = () => {
    const context = useContext(DummyActionContext)
    if (context === undefined) {
        throw new Error("useDummyActions must be used within a DummyProvider");
    }
    return context
}