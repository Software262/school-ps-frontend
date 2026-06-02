import { useState, useCallback } from 'react';
import { getPaymentHistory, getPaymentReceipt } from '../api/auditApi';

export const useAuditHistory = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPaymentHistory = useCallback(async (studentId: number, year?: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPaymentHistory(studentId, year);
      return data;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al obtener el historial');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPaymentReceipt = useCallback(async (pagoId: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPaymentReceipt(pagoId);
      return data;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al obtener el comprobante');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, fetchPaymentHistory, fetchPaymentReceipt };
};
