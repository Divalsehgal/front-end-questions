/**
 * fetchJson<T>(url, init?) → Promise<T>
 * - throws an Error whose message includes the status for a non-OK response (fetch only rejects on network errors)
 * - passes init (e.g. an AbortSignal) through to fetch
 * The caller supplies T: const post = await fetchJson<Post>('/posts/1').
 */
export async function fetchJson(url: string, init?: RequestInit): Promise<unknown> {
  // your code
}
