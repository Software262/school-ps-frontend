import { useEffect, useState, useCallback } from 'react';
import type { Inventory } from '@/entities/inventory/model/types';
import { loadBand } from '@/features/load-band-inventory/api/load-band';

export const useLoadInventory = () => {
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refetchKey, setRefetchKey] = useState(0);

  useEffect(() => {
    loadBand()
      .then((data) => {
        setInventory(data);
        setError(null);
      })
      .catch((err: unknown) => {
        console.error('Error cargando inventario:', err);
        setError('Error al cargar el inventario de banda');
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
