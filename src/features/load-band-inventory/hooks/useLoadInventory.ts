import { useEffect, useState } from 'react';
import type { Inventory } from '@/entities/inventory/model/types';
import { loadBand } from '@/features/load-band-inventory/api/load-band';

export const useLoadInventory = () => {
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBand()
      .then((data) => {
        setInventory(data);
      })
      .catch((err: unknown) => {
        console.error('Error cargando inventario:', err);
        setError('Error al cargar el inventario de banda');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return {
    inventory,
    loading,
    error,
  };
};
