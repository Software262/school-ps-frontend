import type { ModuleStat } from '@/shared/hooks/useModuleStats';

const variantClass: Record<ModuleStat['variant'], string> = {
  default: 'stat-default',
  green: 'stat-green',
  yellow: 'stat-yellow',
  gray: 'stat-gray',
};

interface ModuleStatsProps {
  stats: ModuleStat[];
  className?: string;
}

export const ModuleStats = ({ stats, className = 'band-stats' }: ModuleStatsProps) => (
  <div className={className}>
    {stats.map((stat) => (
      <div key={stat.label} className={`stat-card ${variantClass[stat.variant]}`}>
        <p className="stat-label">{stat.label}</p>
        <p className="stat-value">{stat.value}</p>
      </div>
    ))}
  </div>
);
