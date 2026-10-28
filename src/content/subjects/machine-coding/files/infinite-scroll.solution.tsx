import { useCallback, useEffect, useRef, useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  picture: string;
}

const MAX_PAGES = 10; // the API never runs out, so stop somewhere

export default function InfiniteScroll() {
  const [items, setItems] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasMore = page < MAX_PAGES;

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://randomuser.me/api/?page=${page}&results=20&seed=grind`);
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      const newUsers: User[] = data.results.map((u: any) => ({
        id: u.login.uuid,
        name: `${u.name.first} ${u.name.last}`,
        email: u.email,
        picture: u.picture.thumbnail,
      }));
      setItems((prev) => [...prev, ...newUsers]); // functional update: append to the latest list
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // A callback ref runs every time the last <li> changes. We stop watching the old one
  // and watch the new one. When it scrolls into view, load the next page.
  const observer = useRef<IntersectionObserver | null>(null);
  const lastItemRef = useCallback(
    (node: HTMLLIElement | null) => {
      if (isLoading) return; // already loading: don't ask for another page
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore],
  );

  return (
    <div className="mx-auto max-w-xl p-6">
      <h2 className="mb-4 text-xl font-bold text-text-main">Users ({items.length})</h2>

      <ul className="space-y-2">
        {items.map((user, index) => (
          <li
            key={user.id}
            ref={index === items.length - 1 ? lastItemRef : undefined}
            className="flex items-center gap-3 rounded-lg border border-border-subtle bg-surface p-3"
          >
            <img src={user.picture} alt="" className="size-10 rounded-full" />
            <div>
              <p className="font-medium text-text-main">{user.name}</p>
              <p className="text-sm text-text-muted">{user.email}</p>
            </div>
          </li>
        ))}
      </ul>

      {isLoading && <p className="py-6 text-center text-text-muted">Loading...</p>}
      {error && (
        <p className="py-6 text-center text-error">
          {error} <button onClick={fetchUsers} className="underline">Retry</button>
        </p>
      )}
      {!hasMore && <p className="py-6 text-center text-text-muted">That's everyone.</p>}

      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed right-6 bottom-6 rounded-full bg-brand-500 px-4 py-2 text-text-inverted"
      >
        ↑ Top
      </button>
    </div>
  );
}
