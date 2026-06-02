interface StatCard {
  label: string;
  value: string;
  variant: 'default' | 'green' | 'yellow' | 'gray';
}

interface BandStatsProps {
  stats: StatCard[];
}

export const BandStats = ({ stats }: BandStatsProps) => {
  const getVariantClass = (variant: string) => {
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
