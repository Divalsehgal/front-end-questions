export default function Reviews({ reviews }: { reviews: any[] }) {
  if (!reviews || reviews.length === 0) {
    return <p className="text-gray-500 text-sm mt-4 italic">No reviews yet.</p>;
  }

  const average = (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1);

  return (
    <div className="mt-6 border-t pt-4">
      <h4 className="font-semibold text-gray-800 flex items-center gap-2">
        Reviews
        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-full">
          ★ {average}
        </span>
      </h4>
      <div className="mt-3 space-y-3">
        {reviews.map((r: any) => (
          <div key={r.id} className="text-sm">
            <div className="flex items-center gap-1 font-medium text-gray-700">
              {r.email.split('@')[0]} <span className="text-yellow-500">{"★".repeat(r.rating)}</span>
            </div>
            <p className="text-gray-600 line-clamp-2">{r.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
