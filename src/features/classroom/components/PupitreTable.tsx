// src/features/pupitre/components/PupitreTable.tsx
import { DataTable } from '@/shared/ui';
import { Badge } from '@/shared/ui/atoms/Badge';
import { Pencil } from 'lucide-react';

interface TableRow {
  id: number;
  estudiante_id: number;
  documento: string;
  nombre_estudiante: string;
  grado: string;
  estado_pupitre: boolean;
  docente_titular?: string;
}

interface PupitreTableProps {
  data: TableRow[];
  onEdit?: (row: TableRow) => void;
}

export const PupitreTable = ({ data, onEdit }: PupitreTableProps) => {
  const COLUMNS = [
    { key: 'documento', label: 'Código' },
    { key: 'nombre_estudiante', label: 'Nombre' },
    { key: 'grado', label: 'Curso' },
    { key: 'docente_titular', label: 'Docente Titular' },
    {
      key: 'estado_pupitre',
      label: 'Estado Pupitre',
      render: (val: unknown) => (
        <Badge variant={(val as boolean) ? 'green' : 'red'}>
          {(val as boolean) ? 'Bueno' : 'Malo'}
        </Badge>
      ),
    },
    {
      key: 'estudiante_id',
      label: '',
      render: (_: unknown, row: unknown) =>
        onEdit ? (
          <button
            onClick={() => {
              onEdit(row as TableRow);
            }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}
          >
            <Pencil size={16} />
          </button>
        ) : null,
    },
  ];

  return <DataTable columns={COLUMNS} data={data} emptyMessage="No hay pupitres encontrados" />;
};
