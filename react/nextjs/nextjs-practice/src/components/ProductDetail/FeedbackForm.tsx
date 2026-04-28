"use client";

import { useState } from "react";
import { submitProductFeedback } from "@/services/productActions";

export default function FeedbackForm({ productId }: { productId: string }) {
  const [status, setStatus] = useState<{ error?: string; success?: string } | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    setStatus(null);
    
    const result = await submitProductFeedback(formData);
    
    setIsPending(false);
    setStatus(result);

    if (result.success) {
      // Clear form
      (document.getElementById("feedback-form") as HTMLFormElement).reset();
    }
  }

  return (
    <div className="mt-12 p-8 bg-gray-50 rounded-2xl border border-gray-100">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Share your feedback</h3>
      
      <form id="feedback-form" action={handleSubmit} className="space-y-4">
        <input type="hidden" name="productId" value={productId} />
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
          <select 
            name="rating" 
            required
            className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          >
            <option value="5">5 - Excellent</option>
            <option value="4">4 - Very Good</option>
            <option value="3">3 - Good</option>
            <option value="2">2 - Fair</option>
            <option value="1">1 - Poor</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
          <textarea 
            name="feedback" 
            required
            rows={3}
            placeholder="What did you think about this product?"
            className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
        </div>

        <button 
          type="submit" 
          disabled={isPending}
          className={`w-full py-3 rounded-xl font-bold text-white transition-all shadow-md ${
            isPending ? "bg-gray-400 cursor-not-out" : "bg-gray-900 hover:bg-black active:scale-[0.98]"
          }`}
        >
          {isPending ? "Submitting..." : "Submit Feedback"}
        </button>

        {status?.success && (
          <p className="text-green-600 text-sm font-medium text-center">{status.success}</p>
        )}
        {status?.error && (
          <p className="text-red-600 text-sm font-medium text-center">{status.error}</p>
        )}
      </form>
    </div>
  );
}
