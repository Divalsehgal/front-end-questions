
import React from 'react'
export default function Checkbox({

  id,
  label,
  onChange,
  checked,
}: Readonly<{
  id: string | number;
  label: string;
  onChange: (id: string | number) => void;
  checked: boolean;
}>) {
  const onChangeHandler = (id: string | number): (() => void) => {
    return function () {
      onChange(id);
    };
  };
  return (
      <label htmlFor={label}>
        {label}
        <input
          type="checkbox"
          name={label}
          onChange={onChangeHandler(id)}
          checked={checked}
        />
      </label>
  );
}
