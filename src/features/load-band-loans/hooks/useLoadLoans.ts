import { useEffect, useState } from 'react';
import type { Loan } from '@/entities/loan/model';
import { loadLoans } from '../api/load-loans';

export const useLoadLoans = () => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadLoans()
      .then((data) => {
        setLoans(data);
      })
      .catch((err: unknown) => {
        console.error('Error cargando préstamos:', err);
        setError('Error al cargar los préstamos');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return {
    loans,
    loading,
    error,
  };
};
