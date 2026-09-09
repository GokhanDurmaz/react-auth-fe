import { useState, useEffect } from 'react';

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useFetch<T>(fetchFn: () => Promise<T>, autoFetch = true) {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: autoFetch,
    error: null,
  });

  const execute = async () => {
    setState({ data: null, loading: true, error: null });
    try {
      const result = await fetchFn();
      setState({ data: result, loading: false, error: null });
    } catch (err: any) {
      setState({
        data: null,
        loading: false,
        error: err?.response?.data?.message || err?.message || 'Bir hata oluştu.',
      });
    }
  };

  useEffect(() => {
    if (autoFetch) {
      execute();
    }
  }, []);

  return { ...state, refetch: execute };
}