import { useState, useCallback } from 'react';
import { bulkUpdatePupitre, bulkUpdatePupitreByGrade } from '../api/bulkUpdatePupitre';

export const useBulkUpdatePupitre = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Confirm payments by providing selected student IDs (used by ClassroomPage / BulkConfirmModal)
  const bulkUpdate = useCallback(async (grado_id: number, estudiante_ids: number[]) => {
    setLoading(true);
    setError(null);
    try {
      const response = await bulkUpdatePupitre(grado_id, { estudiante_ids });
      return response.data;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al confirmar los pagos');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update entire grade state (used by BulkUpdateForm)
  const ejecutarBulkUpdate = useCallback(
    async (grado_id: number, estado: boolean, observacion: string | null) => {
      setLoading(true);
      setError(null);
      try {
        const response = await bulkUpdatePupitreByGrade(grado_id, { estado, observacion });
        return response.data;
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Error al actualizar los pupitres');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { loading, error, bulkUpdate, ejecutarBulkUpdate };
};
