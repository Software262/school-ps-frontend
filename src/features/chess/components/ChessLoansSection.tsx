import { DataTable } from '@/shared/ui/molecules/DataTable';
import type { ChessLoan } from '@/features/chess/model/types';

interface Props {
  loans: ChessLoan[];
  onReturnLoan: (loan: ChessLoan) => void;
}

export const ChessLoansSection = ({ loans, onReturnLoan }: Props) => (
  <div className="loans-section">
    <div className="loans-header">
      <div className="loans-header-buttons">
        <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
          Seleccione un préstamo activo para devolver
        </span>
      </div>
    </div>
    <DataTable
      columns={[
        { key: 'id', label: 'ID' },
        { key: 'nombre_articulo', label: 'Artículo' },
        { key: 'nombre_estudiante', label: 'Estudiante' },
        {
          key: 'fecha_salida',
          label: 'Fecha Salida',
          render: (value: unknown) => {
            const ts = value as number;
            return new Date(ts * 1000).toLocaleDateString('es-CO');
          },
        },
        {
          key: 'estado_prestamo',
          label: 'Estado',
          render: (value: unknown) => {
            const activo = value as boolean;
            return activo ? (
              <span style={{ color: '#b45309', fontWeight: 600 }}>Activo</span>
            ) : (
              <span style={{ color: '#2d7d46', fontWeight: 600 }}>Devuelto</span>
            );
          },
        },
        {
          key: 'acciones',
          label: 'Acciones',
          render: (_value: unknown, row: ChessLoan) =>
            row.estado_prestamo ? (
              <button
                className="btn-return-loan"
                style={{ padding: '6px 14px', fontSize: 'var(--font-size-xs)' }}
                onClick={(e) => {
                  e.stopPropagation();
                  onReturnLoan(row);
                }}
              >
                Devolver
              </button>
            ) : null,
        },
      ]}
      data={loans}
      emptyMessage="No hay préstamos registrados"
    />
  </div>
);
