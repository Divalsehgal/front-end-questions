import { getProductStock } from "@/services/productService";

export default async function Stock({ productId }: { productId: string }) {
  const stockStatus = await getProductStock(productId);
  const isOutOfStock = stockStatus.includes("Out of stock");

  return (
    <div className={`text-sm font-medium mt-1 ${isOutOfStock ? "text-red-600" : "text-green-600"}`}>
      {stockStatus}
    </div>
  );
}
