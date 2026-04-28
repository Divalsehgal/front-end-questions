import { Suspense } from "react";
import Link from "next/link";
import AddToCart from "./AddToCart";
import VariantSelector from "./VariantSelector";
import ReviewsContainer from "./ReviewsContainer";

import LikeButton from "./LikeButton";
import HydrationSafeTime from "../HydrationSafeTime";

interface Product {
  id: string;
  slug: string;
  name: string;
  price: string;
  image: string;
  description?: string;
  variants: { id: string; name: string }[];
}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col h-full relative">
      {/* SEO + Prefetch */}
      {/* High-probability navigation, next/link prefetches automatically */}
      <Link href={`/product/${product.slug}`} className="block relative group overflow-hidden bg-white p-4 h-64 flex items-center justify-center">
        <div className="absolute top-4 right-4 z-10">
          <LikeButton />
        </div>
        <img 
          src={product.image} 
          alt={product.name} 
          className="max-h-full max-w-full object-contain transform group-hover:scale-105 transition-transform duration-500" 
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
      </Link>

      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2 gap-4">
          <Link href={`/product/${product.slug}`}>
            <h3 className="text-lg font-bold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2">
              {product.name}
            </h3>
          </Link>
          <p className="text-lg font-black text-gray-900 whitespace-nowrap">{product.price}</p>
        </div>

        <p className="text-sm text-gray-500 mb-4 line-clamp-3" title={product.description}>
          {product.description || "Experience premium quality and performance with our latest product. Designed for enthusiasts and professionals alike."}
        </p>

        <div className="mt-auto">
          {/* Minimal Hydration: These are client components */}
          <VariantSelector variants={product.variants} />
          <AddToCart product={product} />
        </div>

        {/* Non-blocking Streaming */}
        <Suspense 
          fallback={
            <div className="mt-6 border-t pt-4">
              <div className="animate-pulse flex space-x-4">
                <div className="flex-1 space-y-4 py-1">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </div>
              </div>
            </div>
          }
        >
          <ReviewsContainer productId={product.id} />
        </Suspense>

        <div className="mt-4 pt-4 border-t">
          <HydrationSafeTime />
        </div>
      </div>
    </div>
  );
}
