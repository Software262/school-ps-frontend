import { useState, useCallback, useRef } from 'react';
import { searchStudents } from '../api/searchApi';
import type { StudentSearchListResponse } from '../types';

export const useSearchStudents = () => {
  const [data, setData] = useState<StudentSearchListResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchStudents = useCallback(
    async (params: { documento?: string; nombre?: string; year?: number }) => {
      abortControllerRef.current?.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;

      setLoading(true);
      setError(null);
      try {
        const response = await searchStudents(params, controller.signal);
        if (!controller.signal.aborted) {
          setData(response);
        }
        return response;
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === 'AbortError') return null;
        if (!controller.signal.aborted) {
          setError(err instanceof Error ? err.message : 'Error al buscar estudiantes');
        }
        throw err;
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    },
    [],
  );

  return { data, loading, error, fetchStudents };
};
