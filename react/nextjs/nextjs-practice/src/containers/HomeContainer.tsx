import ProductCard from "@/components/ProductCard/ProductCard";
import Filters from "@/components/Filters";

export default function HomeContainer({ products }: { products: any[] }) {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
            Optimized Product Listing
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            Showcasing Next.js App Router performance with Server/Client components, Streaming, and Prefetching.
          </p>
        </div>

        {/* URL State Example: Filters (Client Component) */}
        <Filters />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
