import { useState } from 'react';

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
  // your code
  return <div className="p-6">Start building here</div>;
}
