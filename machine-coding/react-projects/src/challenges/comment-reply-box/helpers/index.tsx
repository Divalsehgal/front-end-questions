export const formatTimestamp = (timestamp: string): string => {
  const currentDate = new Date().getTime();
  const postDate = new Date(timestamp).getTime();

  const minutesAgo = Math.round((currentDate - postDate) / (1000 * 60));
  const hoursAgo = Math.round(minutesAgo / 60);
  const daysAgo = Math.round(hoursAgo / 24);

  if (minutesAgo < 1) {
    return "Just now";
  } else if (minutesAgo < 60) {
    return `Posted ${minutesAgo} minute${minutesAgo !== 1 ? "s" : ""} ago`;
  } else if (hoursAgo < 24) {
    return `Posted ${hoursAgo} hour${hoursAgo !== 1 ? "s" : ""} ago`;
  } else if (daysAgo < 7) {
    return `Posted ${daysAgo} day${daysAgo !== 1 ? "s" : ""} ago`;
  } else {
    return `Posted on ${new Date(
      Number(timestamp) * 1000
    ).toLocaleDateString()}`;
  }
};