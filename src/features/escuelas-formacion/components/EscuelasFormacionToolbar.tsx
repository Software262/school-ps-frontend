import { ChevronDown, Plus, Users } from 'lucide-react';
import type { Period } from '../model/types';

interface EscuelasFormacionToolbarProps {
  periods: Period[];
  selectedPeriod: string;
  onPeriodChange: (value: string) => void;
  activeCount: number;
  pendingCount: number;
  onNewEnrollment: () => void;
}

export const EscuelasFormacionToolbar = ({
  periods,
  selectedPeriod,
  onPeriodChange,
  activeCount,
  pendingCount,
  onNewEnrollment,
}: EscuelasFormacionToolbarProps) => {
  return (
    <div className="ef-toolbar">
      <div className="ef-period-select-wrap">
        <label htmlFor="ef-periodo" className="ef-period-label">
          Período académico
        </label>
        <div className="ef-select-wrapper">
          <select
            id="ef-periodo"
            className="ef-period-select"
            value={selectedPeriod}
            onChange={(e) => {
              onPeriodChange(e.target.value);
            }}
          >
            {periods.length === 0 && <option value="">Sin períodos activos</option>}
            {periods.map((p) => (
              <option key={p.id} value={p.id}>
                {new Date(p.periodo_electivo).getFullYear()} — Período #{p.id}
              </option>
            ))}
          </select>
          <ChevronDown className="ef-select-icon" size={14} />
        </div>
      </div>

      <div className="ef-toolbar-right">
        {selectedPeriod && (
          <div className="ef-stats">
            <span className="ef-stat">
              <Users size={13} />
              {activeCount} inscrito{activeCount !== 1 ? 's' : ''}
            </span>
            {pendingCount > 0 && (
              <span className="ef-stat ef-stat--warn">
                {pendingCount} pendiente{pendingCount !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        )}
        <button className="btn btn-primary" onClick={onNewEnrollment}>
          <Plus size={14} />
          Nueva Inscripción
        </button>
      </div>
    </div>
  );
};
