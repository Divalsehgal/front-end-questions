export async function getReviewsByProductId(productId: string) {
  // Simulate a slightly slower network call for the Suspense demo
  await new Promise((resolve) => setTimeout(resolve, 2000));

  try {
    const res = await fetch(
      `https://jsonplaceholder.typicode.com/posts/${productId}/comments`
    );
    
    if (!res.ok) {
      throw new Error("Failed to fetch reviews");
    }

    const reviews = await res.json();

    // Generate fake ratings and limit to top 3
    return reviews.slice(0, 3).map((r: any, i: number) => ({
      ...r,
      rating: Math.max(3, 5 - (i % 3)), // Generates 5, 4, 3
    }));
  } catch (err) {
    console.error("Review Fetch Error:", err);
    return [];
  }
}
