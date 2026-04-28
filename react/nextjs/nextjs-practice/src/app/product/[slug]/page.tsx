import ProductDetailContainer from "@/containers/ProductDetailContainer";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  return <ProductDetailContainer slug={slug} />;
}
