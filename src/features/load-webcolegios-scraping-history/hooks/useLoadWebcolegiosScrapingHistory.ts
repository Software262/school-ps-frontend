import { useCallback, useEffect, useState } from 'react';
import {
  clearWebcolegiosScrapingHistory,
  loadWebcolegiosScrapingHistory,
  loadWebcolegiosScrapingStatus,
} from '../api/load-webcolegios-scraping-history';
import type { WebcolegiosScrapingHistoryItem, WebcolegiosScrapingStatusResponse } from '../types';

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error && error.message) return error.message;
  return 'No se pudo cargar el historial de scraping.';
};

export const useLoadWebcolegiosScrapingHistory = () => {
  const [history, setHistory] = useState<WebcolegiosScrapingHistoryItem[]>([]);
  const [status, setStatus] = useState<WebcolegiosScrapingStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (showLoading = true): Promise<void> => {
    if (showLoading) setLoading(true);
    try {
      const [historyResponse, statusResponse] = await Promise.all([
        loadWebcolegiosScrapingHistory(),
        loadWebcolegiosScrapingStatus(),
      ]);
      setHistory(historyResponse);
      setStatus(statusResponse);
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

  const clearHistory = useCallback(async (): Promise<void> => {
    setClearing(true);
    try {
      await clearWebcolegiosScrapingHistory();
      setHistory([]);
      setStatus(null);
      setError(null);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setClearing(false);
    }
  }, []);

  return {
    history,
    status,
    loading,
    clearing,
    error,
    refetch,
    clearHistory,
  };
};
