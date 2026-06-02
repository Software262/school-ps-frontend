import { useEffect, useState, useCallback } from 'react';
import type { Loan } from '@/entities/loan/model';
import { loadLoans } from '../api/load-loans';

export const useLoadLoans = () => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refetchKey, setRefetchKey] = useState(0);

  useEffect(() => {
    loadLoans()
      .then((data) => {
        setLoans(data);
        setError(null);
      })
      .catch((err: unknown) => {
        console.error('Error cargando préstamos:', err);
        setError('Error al cargar los préstamos');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [refetchKey]);

  /** Vuelve a cargar los préstamos desde la API. */
  const refetch = useCallback(() => {
    setLoading(true);
    setRefetchKey((k) => k + 1);
  }, []);

  return { loans, loading, error, refetch };
};
