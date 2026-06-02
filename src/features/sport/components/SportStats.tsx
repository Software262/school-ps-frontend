import type { SportStat } from '../hooks/useSportStats';

interface SportStatsProps {
  stats: SportStat[];
}

const getVariantClass = (variant: SportStat['variant']) => {
  switch (variant) {
    case 'green':
      return 'stat-green';
    case 'yellow':
      return 'stat-yellow';
    case 'gray':
      return 'stat-gray';
    default:
      return 'stat-default';
  }
};

export const SportStats = ({ stats }: SportStatsProps) => {
  return (
    <div className="sport-stats">
      {stats.map((stat) => (
        <div key={stat.label} className={`stat-card ${getVariantClass(stat.variant)}`}>
          <p className="stat-label">{stat.label}</p>
          <p className="stat-value">{stat.value}</p>
        </div>
      ))}
    </div>
  );
};
