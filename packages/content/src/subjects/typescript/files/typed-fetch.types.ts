type __Post = { id: number; title: string };
async function __typed() {
  const post = await fetchJson<__Post>('/posts/1');
  const title: string = post.title;
  // @ts-expect-error the result is typed, so unknown fields are errors
  post.nope;
  return title;
}
