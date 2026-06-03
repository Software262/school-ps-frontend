import { useEffect, useState, useCallback } from 'react';
import type { Inventory } from '@/entities/inventory/model/types';
import { loadSportInventory } from '@/features/load-sport-inventory/api/load-sport-inventory';

export const useLoadSportInventory = () => {
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refetchKey, setRefetchKey] = useState(0);

  useEffect(() => {
    loadSportInventory()
      .then((data) => {
        setInventory(data);
        setError(null);
      })
      .catch((err: unknown) => {
        console.error('Error cargando inventario de deportes:', err);
        setError('Error al cargar el inventario de deportes');
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
