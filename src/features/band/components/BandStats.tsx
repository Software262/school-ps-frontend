import type { BandStat } from '../hooks/useBandStats';

interface BandStatsProps {
  stats: BandStat[];
}

const getVariantClass = (variant: BandStat['variant']) => {
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

export const BandStats = ({ stats }: BandStatsProps) => {
  return (
    <div className="band-stats">
      {stats.map((stat) => (
        <div key={stat.label} className={`stat-card ${getVariantClass(stat.variant)}`}>
          <p className="stat-label">{stat.label}</p>
          <p className="stat-value">{stat.value}</p>
        </div>
      ))}
    </div>
  );
};
