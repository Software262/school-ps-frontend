import { DataTable } from '@/shared/ui/molecules/DataTable';
import type { ChessLoan } from '@/features/chess/model/types';

function formatDate(value: string | null | undefined): string {
  if (!value) return '—';
  const d = new Date(value);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('es-CO', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getStatusInfo(loan: ChessLoan) {
  if (loan.estado_prestamo) {
    return { label: 'Activo', className: 'text-activo' };
  }
  if (loan.novedad_pendiente) {
    return { label: 'Espera Reposición', className: 'text-warning' };
  }
  return { label: 'Devuelto', className: 'text-devuelto' };
}

interface Props {
  loans: ChessLoan[];
  onReturnLoan: (loan: ChessLoan) => void;
  onResolveLoan: (loan: ChessLoan) => void;
}

export const ChessLoansSection = ({ loans, onReturnLoan, onResolveLoan }: Props) => (
  <div className="loans-section">
    <div className="loans-header">
      <div className="loans-header-buttons">
        <span className="chess-hint">Seleccione un préstamo activo para devolver</span>
      </div>
    </div>
    <DataTable
      columns={[
        { key: 'nombre_articulo', label: 'Artículo' },
        { key: 'nombre_estudiante', label: 'Estudiante' },
        {
          key: 'fecha_salida',
          label: 'Fecha Salida',
          render: (value: unknown) => formatDate(value as string),
        },
        {
          key: 'fecha_devolucion',
          label: 'Fecha Devolución',
          render: (value: unknown) => formatDate(value as string | null),
        },
        {
          key: 'estado_prestamo',
          label: 'Estado',
          render: (_value: unknown, row: ChessLoan) => {
            const info = getStatusInfo(row);
            return <span className={info.className}>{info.label}</span>;
          },
        },
        {
          key: 'observacion',
          label: 'Observación',
          render: (value: unknown) => {
            const text = value as string | null | undefined;
            return <span>{text ?? '—'}</span>;
          },
        },
        {
          key: 'acciones',
          label: 'Acciones',
          render: (_value: unknown, row: ChessLoan) => (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {row.estado_prestamo && (
                <button
                  className="btn-return-loan btn-return-loan-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onReturnLoan(row);
                  }}
                >
                  Devolver
                </button>
              )}
              {!row.estado_prestamo && row.novedad_pendiente && (
                <button
                  className="btn-return-loan btn-return-loan-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onResolveLoan(row);
                  }}
                >
                  Reponer
                </button>
              )}
            </div>
          ),
        },
      ]}
      data={loans}
      emptyMessage="No hay préstamos registrados"
    />
  </div>
);
