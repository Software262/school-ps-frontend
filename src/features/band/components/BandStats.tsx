import { ModuleStats } from '@/shared/ui/organisms/ModuleStats';
import type { ModuleStat } from '@/shared/hooks/useModuleStats';

export const BandStats = ({ stats }: { stats: ModuleStat[] }) => (
  <ModuleStats stats={stats} className="band-stats" />
);
