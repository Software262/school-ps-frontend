/* eslint-disable */
import { useState, useEffect } from 'react';

interface UseFetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/**
 * Generic hook for fetching data from an API endpoint.
 * Re-fetches whenever `url` changes.
 */
export function useFetch<T>(url: string): UseFetchState<T> & { refetch: () => void } {
  const [state, setState] = useState<UseFetchState<T>>({
    data: null,
    loading: true,
    error: null,
  });
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setTimeout(() => setState((prev) => ({ ...prev, loading: true, error: null })), 0);

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => {
        if (!cancelled) {
          setState({ data: json.data ?? null, loading: false, error: null });
        }
      })
      .catch((err: Error) => {
        if (!cancelled) {
          setState({ data: null, loading: false, error: err.message });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [url, tick]);

  return { ...state, refetch: () => { setTick((t) => t + 1); } };
}
