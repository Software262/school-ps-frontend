import { Badge } from '@/shared/ui/atoms/Badge';
import type { ModuloStatus } from '@/features/paz-y-salvo/model/types';

interface ModuleStatusGridProps {
  modulos: ModuloStatus[];
}

export const ModuleStatusGrid = ({ modulos }: ModuleStatusGridProps) => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
      gap: '12px',
    }}
  >
    {modulos.map((mod) => (
      <div
        key={mod.clave}
        className="card"
        style={{
          margin: 0,
          padding: '16px',
          borderLeft: `4px solid ${mod.estado === 'ok' ? 'var(--status-green)' : 'var(--status-red)'}`,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '8px',
          }}
        >
          <strong style={{ fontSize: '0.875rem' }}>{mod.nombre}</strong>
          <Badge variant={mod.estado === 'ok' ? 'green' : 'red'}>
            {mod.estado === 'ok' ? 'OK' : 'Error'}
          </Badge>
        </div>
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: 0 }}>
          {mod.detalle}
        </p>
      </div>
    ))}
  </div>
);
