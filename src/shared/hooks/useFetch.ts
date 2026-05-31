import { useState, useEffect } from "react";

interface UseFetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/**
 * Generic hook for fetching data from an API endpoint.
 * Re-fetches whenever `url` changes.
 */
export function useFetch<T>(
  url: string,
): UseFetchState<T> & { refetch: () => void } {
  const [state, setState] = useState<UseFetchState<T>>({
    data: null,
    loading: true,
    error: null,
  });
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;

    setTimeout(() => {
      setState((prev) => ({ ...prev, loading: true, error: null }));
    }, 0);

    const run = async () => {
      try {
        const res = await fetch(url);

        if (!res.ok) {
          throw new Error(`HTTP ${String(res.status)}`);
        }

        const json: unknown = await res.json();

        let data: T | null = null;
        if (typeof json === "object" && json !== null && "data" in json) {
          const payload = (json as { data?: unknown }).data;
          data = (payload ?? null) as T | null;
        }

        if (!cancelled) {
          setState({ data, loading: false, error: null });
        }
      } catch (err: unknown) {
        if (!cancelled) {
          const message =
            err instanceof Error ? err.message : "Error desconocido";
          setState({ data: null, loading: false, error: message });
        }
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [url, tick]);

  return {
    ...state,
    refetch: () => {
      setTick((t) => t + 1);
    },
  };
}
