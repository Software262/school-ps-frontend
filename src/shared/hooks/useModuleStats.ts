import { useMemo } from 'react';
import type { Inventory } from '@/entities/inventory/model/types';

export interface ModuleStat {
  label: string;
  value: string;
  variant: 'default' | 'green' | 'yellow' | 'gray';
}

export const useModuleStats = (inventory: Inventory[], totalLabel: string): ModuleStat[] =>
  useMemo(() => {
    const total = inventory.reduce((sum, item) => sum + item.cantidad, 0);
    const disponibles = inventory
      .filter((i) => i.estado_objeto === 'disponible')
      .reduce((sum, i) => sum + i.cantidad, 0);
    const prestados = inventory
      .filter((i) => i.estado_objeto === 'prestado')
      .reduce((sum, i) => sum + i.cantidad, 0);
    const mantenimiento = inventory
      .filter((i) => i.estado_objeto === 'mantenimiento')
      .reduce((sum, i) => sum + i.cantidad, 0);

    return [
      { label: totalLabel, value: String(total), variant: 'default' },
      { label: 'Disponibles', value: String(disponibles), variant: 'green' },
      { label: 'Prestados', value: String(prestados), variant: 'yellow' },
      { label: 'Mantenimiento', value: String(mantenimiento), variant: 'gray' },
    ];
  }, [inventory, totalLabel]);
