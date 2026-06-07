import { useState, useEffect } from 'react';
import type { ChessLoan } from '@/features/chess/model/types';
import { getChessType, getChessBorrowings } from '@/features/chess/api/chessApi';

export const useChessLoans = () => {
  const [loans, setLoans] = useState<ChessLoan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      const typeData = await getChessType();
      const resp = await getChessBorrowings(typeData.id);
      setLoans(resp.data ?? []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al cargar préstamos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchData();
  }, []);

  return { loans, loading, error, refetch: fetchData };
};
