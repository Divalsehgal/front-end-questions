"use client";

import { useState } from "react";

interface Variant {
  id: string;
  name: string;
}

export default function VariantSelector({ variants }: { variants: Variant[] }) {
  const [selected, setSelected] = useState<string>(variants[0]?.id);

  if (!variants || variants.length === 0) return null;

  return (
    <div className="mt-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Select Variant
      </label>
      <div className="flex gap-2">
        {variants.map((variant) => (
          <button
            key={variant.id}
            onClick={() => setSelected(variant.id)}
            className={`px-3 py-1 text-sm rounded-full border transition-colors ${
              selected === variant.id
                ? "border-blue-600 bg-blue-50 text-blue-600"
                : "border-gray-300 text-gray-700 hover:border-gray-400"
            }`}
          >
            {variant.name}
          </button>
        ))}
      </div>
    </div>
  );
}
