/**
 * TOPIC: Async Data & Generic Promises
 * Purpose: Creating type-safe wrappers for asynchronous operations.
 */

/**
 * 1. Generic Fetch Wrapper: `fetchData`
 * Accepts a type T that represents the expected shape of the response.
 */
async function fetchData<T>(url: string): Promise<T> {
    const response = await fetch(url);
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json() as T;
}

// 2. Implementation Example
type Post = { id: number; title: string; body: string };

(async () => {
    try {
        console.log("Fetching post...");
        // In a real app, this would be a valid API URL
        const post = await fetchData<Post>("https://jsonplaceholder.typicode.com/posts/1");
        console.log("Post Title:", post.title);
        console.log("Post Body Summary:", post.body.substring(0, 30) + "...");
    } catch (err) {
        console.error("Could not fetch data (Expected if running without network or valid URL)");
    }
})();
