import { useState } from 'react';
import { registerDirectedPayment } from '../api/payApi';

export const usePayEnrollment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitPayment = async (payload: Parameters<typeof registerDirectedPayment>[0]) => {
    setLoading(true);
    setError(null);
    try {
      const response = await registerDirectedPayment(payload);
      return response;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al registrar el pago');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { submitPayment, loading, error };
};
