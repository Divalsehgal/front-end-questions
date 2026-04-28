import HomeContainer from "@/containers/HomeContainer";

async function getProducts() {
  try {
    const res = await fetch('https://fakestoreapi.com/products?limit=6', { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch');
    const data = await res.json();
    
    // Transform to match our component structure where needed
    return data.map((item: any) => ({
      id: item.id.toString(),
      slug: item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name: item.title,
      price: `$${item.price.toFixed(2)}`,
      image: item.image,
      description: item.description,
      // Add fake variants for the sake of the client component exercise
      variants: [
        { id: `v1-${item.id}`, name: 'Default' },
        { id: `v2-${item.id}`, name: 'Premium' }
      ]
    }));
  } catch (error) {
    return [];
  }
}

export default async function Home() {
  const products = await getProducts();
  return <HomeContainer products={products} />;
}
