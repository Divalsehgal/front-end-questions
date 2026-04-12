import React, { useRef } from "react";
import Input, { CustomInputRef } from "./Input";

export default function ImperativeHandleExample() {
  // Create a ref equipped with the CustomInputRef methods exposed by the child
  const customInputRef = useRef<CustomInputRef>(null);

  const handleFocus = () => {
    // Calling the custom 'focus' method exposed via useImperativeHandle
    customInputRef.current?.focus();
  };

  const handleClear = () => {
    // Calling the custom 'clear' method exposed via useImperativeHandle
    customInputRef.current?.clear();
  };

  return (
    <div className="p-6 max-w-lg flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold">useImperativeHandle Hook</h2>
        <p className="text-gray-600">
          A classic example where the child component controls exactly what it exposes 
          to the parent via ref. We expose `focus()` and `clear()` operations.
        </p>
      </div>

      <div className="flex items-center gap-4">
        <label className="font-semibold text-gray-800">Custom Input:</label>
        <Input ref={customInputRef} placeholder="Type something here..." />
      </div>

      <div className="flex gap-4">
        <button 
          onClick={handleFocus}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Focus Input
        </button>
        <button 
          onClick={handleClear}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          Clear Input
        </button>
      </div>
    </div>
  );
}