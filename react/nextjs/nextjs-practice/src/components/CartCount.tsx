"use client";

import { useCart } from "@/context/CartContext";

export default function CartCount() {
  const { cart } = useCart();
  
  return (
    <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
      {cart.length}
    </span>
  );
}
