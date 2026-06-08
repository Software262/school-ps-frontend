import { useState, useEffect, useCallback } from 'react';
import type { ChessInventory } from '@/features/chess/model/types';
import { getChessType } from '@/features/chess/api/chessApi';
import { getChessInventory } from '@/features/load-chess-inventory/api/load-chess-inventory';

export const useChessInventory = () => {
  const [inventory, setInventory] = useState<ChessInventory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refetchKey, setRefetchKey] = useState(0);

  useEffect(() => {
    getChessType()
      .then((typeData) => getChessInventory(typeData.id))
      .then((resp) => {
        setInventory(resp.items);
        setError('');
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Error al cargar inventario');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [refetchKey]);

  const refetch = useCallback(() => {
    setLoading(true);
    setRefetchKey((k) => k + 1);
  }, []);

  return { inventory, loading, error, refetch };
};
