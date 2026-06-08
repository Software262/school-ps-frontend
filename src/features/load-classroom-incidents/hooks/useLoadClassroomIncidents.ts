import { useCallback, useEffect, useState } from 'react';
import { loadClassroomIncidents } from '../api/load-incidents';
import type { IncidenciaConEstudiante } from '@/features/classroom-holder/model/types';

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (error instanceof Error && error.message) return error.message;
  return fallback;
};

export const useLoadClassroomIncidents = () => {
  const [incidents, setIncidents] = useState<IncidenciaConEstudiante[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [refetchKey, setRefetchKey] = useState(0);

  useEffect(() => {
    loadClassroomIncidents()
      .then((items) => {
        setIncidents(items);
        setError(null);
        setHasLoaded(true);
      })
      .catch((err: unknown) => {
        setIncidents([]);
        setError(getErrorMessage(err, 'Error al cargar las incidencias.'));
        setHasLoaded(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [refetchKey]);

  const refetch = useCallback(() => {
    setLoading(true);
    setRefetchKey((key) => key + 1);
  }, []);

  return { incidents, loading, error, hasLoaded, refetch };
};
