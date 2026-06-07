import { useState, useEffect } from 'react';
import type { ChessInventory } from '@/features/chess/model/types';
import { getChessType, getChessInventory } from '@/features/chess/api/chessApi';

export const useChessInventory = () => {
  const [inventory, setInventory] = useState<ChessInventory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      const typeData = await getChessType();
      const resp = await getChessInventory(typeData.id);
      setInventory(resp.data ?? []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al cargar inventario');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchData();
  }, []);

  return { inventory, loading, error, refetch: fetchData };
};
