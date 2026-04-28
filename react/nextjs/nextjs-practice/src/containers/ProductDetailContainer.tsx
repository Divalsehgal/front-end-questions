import { Suspense } from "react";
import Link from "next/link";
import ProductInfo from "@/components/ProductDetail/ProductInfo";
import Price from "@/components/ProductDetail/Price";
import Stock from "@/components/ProductDetail/Stock";
import FeedbackForm from "@/components/ProductDetail/FeedbackForm";
import ReviewsContainer from "@/components/ProductCard/ReviewsContainer";
import { getProductDetails } from "@/services/productService";

export default async function ProductDetailContainer({ slug }: { slug: string }) {
  // Static content fetched with ISR
  const product = await getProductDetails(slug);

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Link 
          href="/" 
          className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500 mb-8 transition-colors"
        >
          &larr; Back to Products
        </Link>

        {/* ISR Section: Product Info */}
        <ProductInfo product={product} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-8">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>
            {/* Streaming Section: Reviews */}
            <Suspense fallback={
              <div className="animate-pulse flex space-x-4">
                <div className="flex-1 space-y-4 py-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </div>
              </div>
            }>
              <ReviewsContainer productId={product.id} />
            </Suspense>

            <FeedbackForm productId={product.id} />
          </div>

          <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 h-fit sticky top-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Purchase</h2>
            
            {/* Dynamic Section: Price */}
            <Suspense fallback={<div className="h-10 bg-gray-200 rounded w-24 animate-pulse"></div>}>
              <Price productId={product.id} />
            </Suspense>

            {/* Dynamic Section: Stock */}
            <Suspense fallback={<div className="h-4 bg-gray-200 rounded w-32 animate-pulse mt-2"></div>}>
              <Stock productId={product.id} />
            </Suspense>

            <button className="w-full mt-8 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md active:scale-[0.98]">
              Add to Cart
            </button>
            
            <div className="mt-6 text-xs text-gray-500 space-y-2">
              <p>• Free shipping on orders over $100</p>
              <p>• 30-day money-back guarantee</p>
              <p>• Secured checkout with SSL</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
