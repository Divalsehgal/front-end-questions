import { useEffect, useState } from 'react';

const url = 'https://jsonplaceholder.typicode.com/users';

type User = { id: number; name: string; email: string };

// loading, data and error live in ONE object, so they always change together.
type UserState = { loading: boolean; data: User[]; error: string | null };

export default function UserList() {
  const [userState, setUserState] = useState<UserState>({ loading: true, data: [], error: null });

  useEffect(() => {
    const controller = new AbortController();

    async function fetchData() {
      try {
        const response = await fetch(url, { signal: controller.signal });
        // fetch only rejects on network errors. A 404 or 500 still "succeeds", so check ok.
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        setUserState({ loading: false, data, error: null });
      } catch (error) {
        if ((error as Error).name === 'AbortError') {
          return; // we aborted it ourselves on unmount
        }
        setUserState({ loading: false, data: [], error: (error as Error).message });
      }
    }

    fetchData();
    return () => controller.abort();
  }, []);

  if (userState.loading) return <p className="p-6 text-text-muted">Loading...</p>;
  if (userState.error) return <p className="p-6 text-error">{userState.error}</p>;

  return (
    <ul className="mx-auto max-w-md divide-y divide-border-subtle p-6">
      {userState.data.map((user) => (
        <li key={user.id} className="py-3">
          <p className="font-medium text-text-main">{user.name}</p>
          <p className="text-sm text-text-muted">{user.email}</p>
        </li>
      ))}
    </ul>
  );
}
