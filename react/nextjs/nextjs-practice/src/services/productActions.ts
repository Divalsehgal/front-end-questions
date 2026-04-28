"use server";

import { revalidatePath } from "next/cache";

export async function submitProductFeedback(formData: FormData) {
  // Simulate database delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const productId = formData.get("productId");
  const feedback = formData.get("feedback");
  const rating = formData.get("rating");

  if (!feedback || !rating) {
    return { error: "Please provide both feedback and a rating." };
  }

  // In a real app, you would save this to a database
  console.log(`Feedback received for Product ${productId}:`, {
    feedback,
    rating,
    timestamp: new Date().toISOString(),
  });

  // Revalidate the PDP to show fresh data (even though we're mocking it)
  revalidatePath(`/product/[slug]`);

  return { success: "Thank you for your feedback!" };
}
