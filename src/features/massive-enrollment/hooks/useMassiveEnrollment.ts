import { useState, useCallback } from 'react';
import { registerMassiveCsv } from '../api/massiveApi';

export const useMassiveEnrollment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitMassive = useCallback(async (periodoId: number, anio: number, file: File) => {
    setLoading(true);
    setError(null);
    try {
      const response = await registerMassiveCsv(periodoId, anio, file);
      return response;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al subir el archivo masivo');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, submitMassive };
};
