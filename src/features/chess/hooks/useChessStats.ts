import { useMemo } from 'react';
import type { ModuleStat } from '@/shared/hooks/useModuleStats';
import type { ChessInventory } from '@/features/chess/model/types';

export const useChessStats = (inventory: ChessInventory[]): ModuleStat[] =>
  useMemo(() => {
    const totalArticulos = inventory.length;
    const totalUnidades = inventory.reduce((sum, i) => sum + i.cantidad_total, 0);
    const availableItems = inventory.reduce((sum, i) => {
      const disp = i.stocks.find((s) => s.estado === 'disponible')?.cantidad ?? 0;
      return sum + Math.max(0, disp);
    }, 0);
    const borrowedItems = inventory.reduce((sum, i) => {
      const prest = i.stocks.find((s) => s.estado === 'prestado')?.cantidad ?? 0;
      return sum + Math.max(0, prest);
    }, 0);
    const damagedItems = inventory.reduce((sum, i) => {
      const mant = i.stocks.find((s) => s.estado === 'mantenimiento')?.cantidad ?? 0;
      return sum + Math.max(0, mant);
    }, 0);

    return [
      { label: 'Total Artículos', value: String(totalArticulos), variant: 'default' },
      { label: 'Total Unidades', value: String(totalUnidades), variant: 'default' },
      { label: 'Disponibles', value: String(availableItems), variant: 'green' },
      { label: 'En Préstamo', value: String(borrowedItems), variant: 'yellow' },
      { label: 'Dañados / Incompletos', value: String(damagedItems), variant: 'gray' },
    ];
  }, [inventory]);
