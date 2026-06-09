import { ModuleStats } from '@/shared/ui/organisms/ModuleStats';
import type { ModuleStat } from '@/shared/hooks/useModuleStats';

export const ChessStats = ({ stats }: { stats: ModuleStat[] }) => (
  <ModuleStats stats={stats} className="sport-stats" />
);
