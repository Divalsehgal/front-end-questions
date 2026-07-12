export const formatTimestamp = (timestamp: string): string => {
  const currentDate = Date.now();
  const postDate = new Date(timestamp).getTime();
  const diffInMinutes = Math.round((currentDate - postDate) / (1000 * 60));

  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

  const diffInHours = Math.round(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;

  const diffInDays = Math.round(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;

  return new Date(postDate).toLocaleDateString();
};
