import { useMemo } from 'react';
import type { ChessInventory, ChessStats } from '@/features/chess/model/types';

export const useChessStats = (inventory: ChessInventory[]): ChessStats => {
  return useMemo(() => {
    const totalItems = inventory.length;
    const availableItems = inventory.filter((i) => i.estado_objeto === 'Disponible').length;
    const borrowedItems = inventory.filter(
      (i) => i.estado_objeto === 'Prestado' || i.cantidad === 0,
    ).length;
    const damagedItems = inventory.filter(
      (i) => i.estado_objeto === 'Dañado' || i.estado_objeto === 'Incompleto',
    ).length;

    return { totalItems, availableItems, borrowedItems, damagedItems };
  }, [inventory]);
};
