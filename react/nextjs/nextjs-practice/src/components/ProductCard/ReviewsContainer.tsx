import Reviews from "./Reviews";
import { getReviewsByProductId } from "@/services/reviewService";

export default async function ReviewsContainer({ productId }: { productId: string }) {
  const reviews = await getReviewsByProductId(productId);

  return <Reviews reviews={reviews} />;
}
