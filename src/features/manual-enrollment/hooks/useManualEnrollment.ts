import { useState, useCallback } from 'react';
import { manualEnrollment } from '../api/manualApi';
import type { ManualEnrollmentPayload } from '../types';

export const useManualEnrollment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitManual = useCallback(async (payload: ManualEnrollmentPayload) => {
    setLoading(true);
    setError(null);
    try {
      const response = await manualEnrollment(payload);
      return response;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al matricular manualmente');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, submitManual };
};
