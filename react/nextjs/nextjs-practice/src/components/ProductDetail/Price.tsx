import { getProductPrice } from "@/services/productService";

export default async function Price({ productId }: { productId: string }) {
  const price = await getProductPrice(productId);

  return (
    <div className="text-3xl font-bold text-gray-900 mt-2">
      {price}
    </div>
  );
}
