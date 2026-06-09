import { useModuleStats } from '@/shared/hooks/useModuleStats';
import type { ModuleStat } from '@/shared/hooks/useModuleStats';
import type { Inventory } from '@/entities/inventory/model/types';

export type SportStat = ModuleStat;

export const useSportStats = (inventory: Inventory[]): SportStat[] =>
  useModuleStats(inventory, 'Total Equipos');
