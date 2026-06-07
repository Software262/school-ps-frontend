import { useState, useCallback } from 'react';
import { bulkUpdatePupitre } from '../api/bulkUpdatePupitre';

export const useBulkUpdatePupitre = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ejecutarBulkUpdate = useCallback(
    async (grado_id: number, estado_pupitre: boolean, observacion: string | null) => {
      setLoading(true);
      setError(null);
      try {
        const response = await bulkUpdatePupitre(grado_id, {
          estado_pupitre,
          observacion,
        });
        return response.data;
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Error al actualizar el curso');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { loading, error, ejecutarBulkUpdate };
};
