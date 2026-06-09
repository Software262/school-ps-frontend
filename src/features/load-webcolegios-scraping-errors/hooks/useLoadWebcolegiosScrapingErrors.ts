import { useCallback, useEffect, useState } from 'react';
import {
  clearWebcolegiosScrapingErrors,
  loadWebcolegiosScrapingErrors,
} from '../api/load-webcolegios-scraping-errors';
import type { WebcolegiosScrapingHistoryItem } from '../types';

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error && error.message) return error.message;
  return 'No se pudo cargar la lista de errores y pendientes.';
};

export const useLoadWebcolegiosScrapingErrors = () => {
  const [errorsList, setErrorsList] = useState<WebcolegiosScrapingHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (showLoading = true): Promise<void> => {
    if (showLoading) setLoading(true);
    try {
      const response = await loadWebcolegiosScrapingErrors();
      setErrorsList(response);
      setError(null);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void load(false);
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [load]);

  const refetch = useCallback(() => load(true), [load]);

  const clearErrors = useCallback(async (): Promise<void> => {
    setClearing(true);
    try {
      await clearWebcolegiosScrapingErrors();
      setErrorsList([]);
      setError(null);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setClearing(false);
    }
  }, []);

  return {
    errorsList,
    loading,
    clearing,
    error,
    refetch,
    clearErrors,
  };
};
