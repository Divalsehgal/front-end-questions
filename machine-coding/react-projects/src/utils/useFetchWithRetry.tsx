import  { useEffect, useState } from 'react';


// Removed unused example App component. This file provides the useFetchWithRetry hook.

type fetchHook = {
  url: string;
  options?: RequestInit;
  retries: number;
  delay: number;
};

type UseFetchReturn<T> = {
  data: T | undefined;
  loading: boolean;
  error: string | null;
};

const useFetchWithRetry = <T,>({ url, options, retries, delay }: fetchHook): UseFetchReturn<T> => {
  const [data, setData] = useState<T | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout> | undefined;
    setLoading(true);

    const fetchData = async (retry: number) => {
      try {
        const data = await fetch(url, {
          ...(options),
          signal: controller.signal,
        });

        if (!data.ok) throw new Error('HTTP error');
        const result = await data.json();
        setData(result);
        setLoading(false);
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        if (error) {
          if (retry === 0) {
            setLoading(false);
            setError('facing some issues');
            
            return;
          }

          timer = setTimeout(() => {
            fetchData(retry - 1);
          }, delay);
        }
      }
    };

    fetchData(retries);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [url, options, retries, delay]);

  return { data, loading, error };
};

export default useFetchWithRetry;
