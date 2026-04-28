"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";

interface AddToCartProps {
  product: {
    id: string;
    name: string;
    price: string;
  };
}

export default function AddToCart({ product }: AddToCartProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  const handleAdd = async () => {
    setIsAdding(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    // Actually add to cart context
    addToCart({
      id: product.id,
      name: product.name,
      // Convert "$99.99" to 99.99
      price: parseFloat(product.price.replace(/[^0-9.-]+/g, "")) || 0,
    });
    
    setIsAdding(false);
    setAdded(true);

    // Reset after a bit
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <button
      onClick={handleAdd}
      disabled={isAdding}
      className={`w-full py-2 px-4 rounded-md font-semibold text-white transition-colors mt-4
        ${
          added
            ? "bg-green-500 hover:bg-green-600"
            : "bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400"
        }
      `}
    >
      {isAdding ? "Adding..." : added ? "Added to Cart!" : "Add to Cart"}
    </button>
  );
}
