import { useState } from 'react';
import { modifyEnrollment, deleteComplementaryDetail } from '../api/modifyApi';

export const useModifyEnrollment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitModification = async (
    matriculaId: number,
    payload: Parameters<typeof modifyEnrollment>[1],
  ) => {
    setLoading(true);
    setError(null);
    try {
      const response = await modifyEnrollment(matriculaId, payload);
      return response;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al modificar matrícula');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const submitDelete = async (detalleId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await deleteComplementaryDetail(detalleId);
      return response;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al desvincular concepto');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { submitModification, submitDelete, loading, error };
};
