import { useMemo } from 'react';
import type { ModuleStat } from '@/shared/hooks/useModuleStats';
import type { ChessInventory, ChessLoan } from '@/features/chess/model/types';

export const useChessStats = (inventory: ChessInventory[], loans: ChessLoan[]): ModuleStat[] =>
  useMemo(() => {
    const totalItems = inventory.reduce((sum, i) => sum + i.cantidad, 0);
    const borrowedItems = loans.filter((l) => l.estado_prestamo).length;
    const damagedItems = inventory
      .filter((i) => i.estado_objeto === 'Dañado' || i.estado_objeto === 'Incompleto')
      .reduce((sum, i) => sum + i.cantidad, 0);
    const availableItems = totalItems - borrowedItems - damagedItems;

    return [
      { label: 'Total Tableros', value: String(totalItems), variant: 'default' },
      { label: 'Disponibles', value: String(availableItems), variant: 'green' },
      { label: 'En Préstamo', value: String(borrowedItems), variant: 'yellow' },
      { label: 'Dañados / Incompletos', value: String(damagedItems), variant: 'gray' },
    ];
  }, [inventory, loans]);
