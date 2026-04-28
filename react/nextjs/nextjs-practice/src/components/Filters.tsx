"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

function FilterButton({ label, value }: { label: string; value: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const isActive = (searchParams.get("category") || "") === value;

  const handleClick = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("category", value);
    } else {
      params.delete("category");
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <button
      onClick={handleClick}
      className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
        isActive 
          ? "bg-blue-600 text-white shadow-md shadow-blue-200" 
          : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300"
      }`}
    >
      {label}
    </button>
  );
}

export default function Filters() {
  return (
    <div className="flex justify-center space-x-4 mb-8">
      <FilterButton label="All" value="" />
      <FilterButton label="Category A" value="a" />
      <FilterButton label="Category B" value="b" />
    </div>
  );
}
