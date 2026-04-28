export async function getProductPrice(productId: string) {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Dynamic fetch (no-store)
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${productId}`, {
    cache: "no-store",
  });

  if (!res.ok) return "Price unavailable";

  // Simulate a price based on some data
  return `$${(Math.random() * 100 + 50).toFixed(2)}`;
}

export async function getProductStock(productId: string) {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1200));

  // Dynamic fetch (no-store)
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${productId}`, {
    cache: "no-store",
  });

  if (!res.ok) return "Stock unavailable";

  // Simulate stock level
  const stock = Math.floor(Math.random() * 20);
  return stock > 0 ? `${stock} units in stock` : "Out of stock";
}

export async function getProductDetails(slug: string) {
  // ISR Fetch (revalidate every 5 mins)
  // In a real app, we would fetch by slug
  const id = slug === "product-1" ? 1 : 2;
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
    next: { 
      revalidate: 300,
      tags: ["product-detail", `product-${slug}`]
    },
  });

  if (!res.ok) throw new Error("Product not found");

  const data = await res.json();

  return {
    id: data.id.toString(),
    name: slug.split("-").map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(" "),
    description: data.body,
    image: `https://picsum.photos/seed/${slug}/600/400`,
  };
}
