export default function ProductInfo({ product }: { product: any }) {
  return (
    <div className="flex flex-col md:flex-row gap-8 mb-12">
      <div className="w-full md:w-1/2">
        <img 
          src={product.image} 
          alt={product.name} 
          className="rounded-2xl shadow-lg w-full h-auto object-cover aspect-[3/2]"
        />
      </div>
      <div className="w-full md:w-1/2 flex flex-col justify-center">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
          {product.name}
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed">
          {product.description}
        </p>
      </div>
    </div>
  );
}
