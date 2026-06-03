import { useMemo } from 'react';
import type { Inventory } from '@/entities/inventory/model/types';

export interface BandStat {
  label: string;
  value: string;
  variant: 'default' | 'green' | 'yellow' | 'gray';
}

/** Calcula las estadísticas de la banda dinámicamente desde el inventario real. */
export const useBandStats = (inventory: Inventory[]): BandStat[] => {
  return useMemo(() => {
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
      { label: 'Total Instrumentos', value: String(total), variant: 'default' },
      { label: 'Disponibles', value: String(disponibles), variant: 'green' },
      { label: 'Prestados', value: String(prestados), variant: 'yellow' },
      { label: 'Mantenimiento', value: String(mantenimiento), variant: 'gray' },
    ];
  }, [inventory]);
};
