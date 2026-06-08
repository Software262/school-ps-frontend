import { useMemo } from 'react';
import type { ChessInventory, ChessLoan, ChessStats } from '@/features/chess/model/types';

export const useChessStats = (inventory: ChessInventory[], loans: ChessLoan[]): ChessStats => {
  return useMemo(() => {
    const totalItems = inventory.reduce((sum, i) => sum + i.cantidad, 0);
    const borrowedItems = loans.filter((l) => l.estado_prestamo).length;
    const damagedItems = inventory
      .filter((i) => i.estado_objeto === 'Dañado' || i.estado_objeto === 'Incompleto')
      .reduce((sum, i) => sum + i.cantidad, 0);
    const availableItems = totalItems - borrowedItems - damagedItems;

    return { totalItems, availableItems, borrowedItems, damagedItems };
  }, [inventory, loans]);
};
