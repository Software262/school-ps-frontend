import { useMemo } from 'react';
import type { Inventory } from '@/entities/inventory/model/types';

export interface ModuleStat {
  label: string;
  value: string;
  variant: 'default' | 'green' | 'yellow' | 'gray';
}

export const useModuleStats = (inventory: Inventory[], totalLabel: string): ModuleStat[] =>
  useMemo(() => {
    const total = inventory.reduce((sum, item) => sum + item.cantidad_total, 0);
    const disponibles = inventory.reduce((sum, item) => {
      const stock = item.stocks.find((s) => s.estado === 'disponible');
      return sum + (stock?.cantidad ?? 0);
    }, 0);
    const prestados = inventory.reduce((sum, item) => {
      const stock = item.stocks.find((s) => s.estado === 'prestado');
      return sum + (stock?.cantidad ?? 0);
    }, 0);
    const mantenimiento = inventory.reduce((sum, item) => {
      const stock = item.stocks.find((s) => s.estado === 'mantenimiento');
      return sum + (stock?.cantidad ?? 0);
    }, 0);

    return [
      { label: totalLabel, value: String(total), variant: 'default' },
      { label: 'Disponibles', value: String(disponibles), variant: 'green' },
      { label: 'Prestados', value: String(prestados), variant: 'yellow' },
      { label: 'Mantenimiento', value: String(mantenimiento), variant: 'gray' },
    ];
  }, [inventory, totalLabel]);
