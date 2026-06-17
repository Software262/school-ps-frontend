import { useState, useCallback } from 'react';
import { updatePupitre } from '../api/updatePupitre';

export const useUpdatePupitre = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ejecutarUpdate = useCallback(async (estudiante_id: number, observacion: string | null) => {
    setLoading(true);
    setError(null);
    try {
      const response = await updatePupitre(estudiante_id, { observacion });
      return response.data;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al confirmar el pago');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, ejecutarUpdate };
};
