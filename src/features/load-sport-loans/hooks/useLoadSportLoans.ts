import { useEffect, useState, useCallback } from 'react';
import type { Loan } from '@/entities/loan/model';
import { loadSportLoans } from '../api/load-sport-loans';

export const useLoadSportLoans = () => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refetchKey, setRefetchKey] = useState(0);

  useEffect(() => {
    loadSportLoans()
      .then((data) => {
        setLoans(data);
        setError(null);
      })
      .catch((err: unknown) => {
        console.error('Error cargando préstamos de deportes:', err);
        setError('Error al cargar los préstamos de deportes');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [refetchKey]);

  const refetch = useCallback(() => {
    setLoading(true);
    setRefetchKey((k) => k + 1);
  }, []);

  return { loans, loading, error, refetch };
};