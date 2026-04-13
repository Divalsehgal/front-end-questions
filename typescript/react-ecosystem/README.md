# The React + TypeScript Ecosystem 🚀

This visual guide maps out exactly how to achieve 100% type safety across the entire React Ecosystem—from handling simple DOM events to designing massive generic architectures.

> [!TIP]
> **Why do we need specific types?** TypeScript cannot auto-infer events in React like `onClick` if you extract the function outside the JSX element. Using strict types like `MouseEvent` guarantees perfect autocomplete and catches crashes before they happen.

---

## 1. Typing Event Handlers
Events are passed down from the DOM. You must grab them using their explicit definitions from the `react` namespace.

```tsx
import { ChangeEvent, MouseEvent, KeyboardEvent, FormEvent } from "react";

// 📝 Text Inputs: Use ChangeEvent + HTMLInputElement
const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
  console.log(e.target.value); 
};

// 🖱️ Buttons: Use MouseEvent + HTMLButtonElement
const handleButton = (e: MouseEvent<HTMLButtonElement>) => {
  e.preventDefault();
};

// ⌨️ Keyboard: Great for accessibility features!
const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
  if (e.key === "Enter") submit();
};

// 📋 Forms: Always type forms to prevent page reloads
const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
};
```

---

## 2. Typing Custom Props & Dispatches
React allows you to pass data and functions wildly between components. Here is how you lock those contracts down.

### Standard Callback Functions
```tsx
type ChildProps = {
  title: string;
  count?: number; // Optional prop
  onAction: (id: string) => void; // A function returning nothing
};

export const CustomElement = ({ title, onAction }: ChildProps) => (
  <div onClick={() => onAction("123")}>{title}</div>
);
```

### Raw `setState` Dispatchers
Sometimes, you just need to pass `setCounter` straight out of a `useState` hook down to a child.

```tsx
import { Dispatch, SetStateAction } from "react";

type StateProps = {
  // Literally the mathematical signature of `useState`
  setCounter: Dispatch<SetStateAction<number>>; 
};
```

---

## 3. The "ComponentProps" Pro-Tip
Want to build a custom `<Button>` but allow users to pass standard HTML attributes (like `disabled` or `aria-label`) without manually recreating 50 types?

Use Intersections (`&`) to merge ALL standard attributes with your custom ones!

```tsx
import { ComponentProps } from "react";

type InteractiveButtonProps = ComponentProps<"button"> & {
  isLoading?: boolean;
};

export const CustomBtn = ({ isLoading, children, ...rest }: InteractiveButtonProps) => (
  <button disabled={isLoading} {...rest}>
    {isLoading ? "Loading..." : children}
  </button>
);
```

---

## 4. Async Data Fetching & Promises
When fetching JSON from standard APIs, TypeScript originally thinks the payload is `any`. You are responsible for safely casting it.

```tsx
type UserResponse = { id: number; name: string };

const fetchUsers = async (): Promise<UserResponse[]> => {
  const response = await fetch("https://api.example.com/users");
  const json = await response.json(); 
  return json as UserResponse[]; // Secure type cast!
};

export const DataComponent = () => {
  // Use `| null` to represent data that is still downloading
  const [data, setData] = useState<UserResponse[] | null>(null);

  useEffect(() => {
    // ⚠️ useEffect callbacks cannot be async natively! Wrap them.
    const run = async () => {
      setData(await fetchUsers());
    };
    run();
  }, [])
}
```

---

## 5. Generic Components `<T>`

> [!IMPORTANT]  
> If you write `<T>` inside a `.tsx` file, TypeScript will crash because it thinks `<T>` is a missing HTML tag! Always write generics as **`<T extends unknown>`** or **`<T,>`**

Use generics when writing reusable layouts (like Lists, Tables, or Carousels) that shouldn't care about the *shape* of the data they are showing!

```tsx
import { ReactNode } from "react";

type GenericListProps<T> = {
  items: T[]; 
  renderItem: (item: T) => ReactNode; // Parent dictates how to draw the UI
  onSelect: (item: T) => void;        // Parent handles the click logic
};

export const GenericList = <T extends unknown>({ items, renderItem, onSelect }: GenericListProps<T>) => {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index} onClick={() => onSelect(item)}>
          {renderItem(item)}
        </li>
      ))}
    </ul>
  );
};
```

---

## 6. Real-World Architecture Examples
Here is how you previously implemented advanced patterns directly inside your machine coding challenges!

### Reducer Unions (From: `reducer-todo`)
Using literal types and Discriminated Unions to make `useReducer` bulletproof.
```tsx
type Status = "Completed" | "Progress" | "Todo";

type TodoAction = 
  | { type: 'ADD'; payload: Todos }
  | { type: 'DELETE'; payload: number };
```

### Deep Array Relationships (From: `comment-reply-box`)
Using arrays of custom interfaces to generate massive, hierarchical data trees.
```tsx
type ReplyProps = { replyId: number; replyData: string; };

type CommentProps = {
  commentId: number;
  replies: ReplyProps[]; // Contains children arrays
};
```

### Exposing Child Methods (From: `ImperativeHandle`)
Defining exactly what a Child component allows a Parent to trigger using `useImperativeHandle`.
```tsx
export interface CustomInputRef {
  focus: () => void;
  clear: () => void;
}

export interface ImperativeInputProps {
  placeholder?: string;
  ref?: React.Ref<CustomInputRef>; // Strongly typing the component Ref
}
```
