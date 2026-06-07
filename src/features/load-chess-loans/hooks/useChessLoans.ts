import { useState, useEffect, useCallback } from 'react';
import type { ChessLoan } from '@/features/chess/model/types';
import { getChessType } from '@/features/chess/api/chessApi';
import { getChessBorrowings } from '@/features/load-chess-loans/api/load-chess-loans';

export const useChessLoans = () => {
  const [loans, setLoans] = useState<ChessLoan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refetchKey, setRefetchKey] = useState(0);

  useEffect(() => {
    getChessType()
      .then((typeData) => getChessBorrowings(typeData.id))
      .then((resp) => {
        setLoans(resp.items);
        setError('');
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Error al cargar préstamos');
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
