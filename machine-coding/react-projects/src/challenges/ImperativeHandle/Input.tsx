import React, { useImperativeHandle, useRef } from "react";

export interface CustomInputRef {
  focus: () => void;
  clear: () => void;
}

interface InputProps {
  placeholder?: string;
  ref?: React.Ref<CustomInputRef>;
}

export default function Input({ placeholder, ref }: InputProps) {
  const internalInputRef = useRef<HTMLInputElement>(null);

  // useImperativeHandle customizes the instance value that is exposed to parent components when using ref.
  useImperativeHandle(ref, () => {
    return {
      focus() {
        // Focus the internal input element
        internalInputRef.current?.focus();
      },
      clear() {
        // Clear the internal input element's value
        if (internalInputRef.current) {
          internalInputRef.current.value = "";
        }
      }
    };
  }, []);

  return (
    <input 
      ref={internalInputRef} 
      placeholder={placeholder} 
      className="px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
    />
  );
}