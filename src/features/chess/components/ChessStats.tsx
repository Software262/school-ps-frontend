import type { ChessStats as ChessStatsType } from '@/features/chess/model/types';

interface StatsProps {
  stats: ChessStatsType;
}

export const ChessStats = ({ stats }: StatsProps) => (
  <div className="sport-stats">
    <div className="stat-card stat-default">
      <p className="stat-label">Total Tableros</p>
      <p className="stat-value">{stats.totalItems}</p>
    </div>
    <div className="stat-card stat-green">
      <p className="stat-label">Disponibles</p>
      <p className="stat-value">{stats.availableItems}</p>
    </div>
    <div className="stat-card stat-yellow">
      <p className="stat-label">En Préstamo</p>
      <p className="stat-value">{stats.borrowedItems}</p>
    </div>
    <div className="stat-card stat-gray">
      <p className="stat-label">Dañados / Incompletos</p>
      <p className="stat-value">{stats.damagedItems}</p>
    </div>
  </div>
);
