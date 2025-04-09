import React from "react";
type inputProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const Input = ({ value, onChange }: inputProps) => (
  <input type="text" value={value} onChange={onChange} placeholder="Starts with @ to mention someone ..." />
);

export default Input;
