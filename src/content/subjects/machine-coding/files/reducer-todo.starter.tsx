import { useState } from 'react';

type Status = "Todo" | "Progress" | "Completed";

interface Todo {
  id: number;
  name: string;
  status: Status;
}

export default function ReducerTodo() {
  // your code
  return <div className="p-6">Start building here</div>;
}
