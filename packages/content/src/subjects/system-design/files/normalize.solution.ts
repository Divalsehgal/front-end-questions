export type Post = { id: string; title: string; author: { id: string; name: string }; comments: { id: string; text: string; author: { id: string; name: string } }[] };
export type Normalized = {
  posts: Record<string, { id: string; title: string; author: string; comments: string[] }>;
  users: Record<string, { id: string; name: string }>;
  comments: Record<string, { id: string; text: string; author: string }>;
  postIds: string[];
};

// Each entity is stored once, by id. Other entities point to it by id,
// so renaming a user updates it everywhere.
export function normalizePosts(posts: Post[]): Normalized {
  const result: Normalized = { posts: {}, users: {}, comments: {}, postIds: [] };

  for (const post of posts) {
    result.postIds.push(post.id);
    result.users[post.author.id] = { ...post.author };

    const commentIds: string[] = [];
    for (const comment of post.comments) {
      result.users[comment.author.id] = { ...comment.author };
      result.comments[comment.id] = { id: comment.id, text: comment.text, author: comment.author.id };
      commentIds.push(comment.id);
    }

    result.posts[post.id] = { id: post.id, title: post.title, author: post.author.id, comments: commentIds };
  }
  return result;
}
