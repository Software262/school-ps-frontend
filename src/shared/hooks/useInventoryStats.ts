import { useEffect, useState, useCallback } from 'react';
import { fetchInventoryStats } from '../api/inventoryStats';
import type { ModuleStat } from './useModuleStats';

export const useInventoryStats = (typeName: string, totalLabel: string) => {
  const [stats, setStats] = useState<ModuleStat[]>([]);
  const [refetchKey, setRefetchKey] = useState(0);

  useEffect(() => {
    fetchInventoryStats(typeName)
      .then((data) => {
        if (!data) return;
        setStats([
          { label: totalLabel, value: String(data.total_items), variant: 'default' },
          { label: 'Disponibles', value: String(data.total_disponibles), variant: 'green' },
          { label: 'Prestados', value: String(data.total_prestados), variant: 'yellow' },
          { label: 'Mantenimiento', value: String(data.total_mantenimiento), variant: 'gray' },
        ]);
      })
      .catch(() => {
        // stats stay as-is on error
      });
  }, [typeName, totalLabel, refetchKey]);

  const refetch = useCallback(() => {
    setRefetchKey((k) => k + 1);
  }, []);

  return { stats, refetch };
};
