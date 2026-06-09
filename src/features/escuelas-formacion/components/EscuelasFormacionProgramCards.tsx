import { Users } from 'lucide-react';
import type { ProgramStat } from '../hooks/useEscuelasFormacionStats';

interface EscuelasFormacionProgramCardsProps {
  programStats: ProgramStat[];
  programFilter: number | null;
  onToggleFilter: (id: number) => void;
}

export const EscuelasFormacionProgramCards = ({
  programStats,
  programFilter,
  onToggleFilter,
}: EscuelasFormacionProgramCardsProps) => {
  if (programStats.length === 0) return null;

  return (
    <div className="ef-programs-grid">
      {programStats.map((p) => {
        const active = programFilter === p.id;
        return (
          <button
            key={p.id}
            type="button"
            className={`ef-program-card${active ? ' ef-program-card--active' : ''}`}
            onClick={() => {
              onToggleFilter(p.id);
            }}
            aria-pressed={active}
            title={active ? 'Quitar filtro' : `Ver inscripciones de ${p.tipo_complementario}`}
          >
            <div className="ef-program-card-name">{p.tipo_complementario}</div>
            <div
              className="ef-program-card-cost"
              title="El valor se configura en el módulo de Matrícula"
            >
              {p.valor > 0 ? `$${p.valor.toLocaleString('es-CO')}` : 'Gratuito'}
            </div>
            <div className="ef-program-card-meta">
              <span className="ef-program-card-count">
                <Users size={11} />
                {p.activeCount} inscrito{p.activeCount !== 1 ? 's' : ''}
              </span>
              {p.pendingCount > 0 && (
                <span className="ef-program-card-pending">
                  {p.pendingCount} pendiente{p.pendingCount !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
};
