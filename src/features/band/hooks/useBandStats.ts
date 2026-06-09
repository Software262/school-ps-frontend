import { useModuleStats } from '@/shared/hooks/useModuleStats';
import type { ModuleStat } from '@/shared/hooks/useModuleStats';
import type { Inventory } from '@/entities/inventory/model/types';

export type BandStat = ModuleStat;

export const useBandStats = (inventory: Inventory[]): BandStat[] =>
  useModuleStats(inventory, 'Total Instrumentos');
