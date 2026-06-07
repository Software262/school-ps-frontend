import { useCallback, useState } from 'react';
import { closeClassroomIncident } from '../api/close-incident';

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (error instanceof Error && error.message) return error.message;
  return fallback;
};

export const useCloseClassroomIncident = (onSuccess: () => void) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const closeIncident = useCallback(
    async (incidentId: number): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        await closeClassroomIncident(incidentId);
        onSuccess();
        return true;
      } catch (err) {
        setError(getErrorMessage(err, 'Error al resolver la incidencia.'));
        return false;
      } finally {
        setLoading(false);
      }
    },
    [onSuccess],
  );

  return { closeIncident, loading, error };
};
