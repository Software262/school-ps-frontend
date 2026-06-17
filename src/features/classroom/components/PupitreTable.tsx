import { DataTable } from '@/shared/ui';
import { CheckCircle, RotateCcw } from 'lucide-react';

interface TableRow {
  id: number;
  estudiante_id: number;
  documento: string;
  nombre_estudiante: string;
  grado: string;
  estado: string;
  docente_titular?: string;
}

interface PupitreTableProps {
  data: TableRow[];
  selectedIds?: Set<number>;
  onToggleSelect?: (estudianteId: number) => void;
  onConfirmarPago?: (row: TableRow) => void;
}

export const PupitreTable = ({
  data,
  selectedIds,
  onToggleSelect,
  onConfirmarPago,
}: PupitreTableProps) => {
  const COLUMNS = [
    ...(onToggleSelect
      ? [
          {
            key: 'select',
            label: '',
            render: (_: unknown, row: unknown) => {
              const r = row as TableRow;
              if (r.estado === 'pagado') return null;
              const id = `select-${String(r.estudiante_id)}`;
              return (
                <label
                  htmlFor={id}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '6px',
                    cursor: 'pointer',
                  }}
                >
                  <input
                    id={id}
                    type="checkbox"
                    checked={selectedIds?.has(r.estudiante_id) ?? false}
                    onChange={() => {
                      onToggleSelect(r.estudiante_id);
                    }}
                    style={{ width: 18, height: 18 }}
                  />
                </label>
              );
            },
          },
        ]
      : []),
    { key: 'documento', label: 'Código' },
    { key: 'nombre_estudiante', label: 'Nombre' },
    { key: 'grado', label: 'Curso' },
    { key: 'docente_titular', label: 'Docente Titular' },
    {
      key: 'estado',
      label: 'Estado de Pago',
      render: (val: unknown) => (
        <span className={`status-badge ${val === 'pagado' ? 'pagado' : 'pendiente'}`}>
          {val === 'pagado' ? 'Pagado' : 'Pendiente'}
        </span>
      ),
    },
    {
      key: 'estudiante_id',
      label: '',
      render: (_: unknown, row: unknown) => {
        const r = row as TableRow;
        if (!onConfirmarPago) return null;
        const esPagado = r.estado === 'pagado';
        return (
          <button
            className={`edit-btn ${esPagado ? 'revertir' : 'confirmar'}`}
            onClick={() => {
              onConfirmarPago(r);
            }}
            title={esPagado ? 'Revertir a pendiente' : 'Confirmar pago'}
          >
            {esPagado ? <RotateCcw size={16} /> : <CheckCircle size={16} />}
          </button>
        );
      },
    },
  ];

  return <DataTable columns={COLUMNS} data={data} emptyMessage="No hay pupitres encontrados" />;
};
