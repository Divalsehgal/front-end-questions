export type Post = { id: string; title: string; author: { id: string; name: string }; comments: { id: string; text: string; author: { id: string; name: string } }[] };

export type Normalized = {
  posts: Record<string, { id: string; title: string; author: string; comments: string[] }>;
  users: Record<string, { id: string; name: string }>;
  comments: Record<string, { id: string; text: string; author: string }>;
  postIds: string[];
};

/**
 * Normalize nested API data into flat lookup tables (like normalizr / RTK entity adapter):
 * entities stored once by id, relations replaced by ids, and the original post order kept in postIds.
 */
export function normalizePosts(posts: Post[]): Normalized {
  // your code
}
