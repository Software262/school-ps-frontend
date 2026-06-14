import { useMemo } from 'react';
import type { ModuleStat } from '@/shared/hooks/useModuleStats';
import type { ChessInventory, ChessLoan } from '@/features/chess/model/types';

export const useChessStats = (inventory: ChessInventory[], loans: ChessLoan[]): ModuleStat[] =>
  useMemo(() => {
    const totalItems = inventory.reduce((sum, i) => sum + i.cantidad_total, 0);
    const borrowedItems = loans.filter((l) => l.estado_prestamo).length;
    const damagedItems = inventory.reduce((sum, i) => {
      const mant = i.stocks.find((s) => s.estado === 'mantenimiento')?.cantidad ?? 0;
      return sum + mant;
    }, 0);
    const availableItems = inventory.reduce((sum, i) => {
      const disp = i.stocks.find((s) => s.estado === 'disponible')?.cantidad ?? 0;
      return sum + disp;
    }, 0);

    return [
      { label: 'Total Tableros', value: String(totalItems), variant: 'default' },
      { label: 'Disponibles', value: String(availableItems), variant: 'green' },
      { label: 'En Préstamo', value: String(borrowedItems), variant: 'yellow' },
      { label: 'Dañados / Incompletos', value: String(damagedItems), variant: 'gray' },
    ];
  }, [inventory, loans]);
