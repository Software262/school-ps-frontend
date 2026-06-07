import { DataTable } from '@/shared/ui/molecules/DataTable';
import type { ChessInventory } from '@/features/chess/model/types';

interface Props {
  inventory: ChessInventory[];
  selectedItem: ChessInventory | null;
  onSelectItem: (item: ChessInventory | null) => void;
  onNewLoan: () => void;
}

export const ChessInventorySection = ({
  inventory,
  selectedItem,
  onSelectItem,
  onNewLoan,
}: Props) => (
  <div className="table-section">
    <div className="inventory-header">
      <div className="inventory-header-buttons">
        {selectedItem && (
          <span className="inventory-selected-hint">Seleccionado: {selectedItem.nombre}</span>
        )}
        <button className="btn-new-item" onClick={onNewLoan} disabled={!selectedItem}>
          + Nuevo Préstamo
        </button>
      </div>
    </div>
    <DataTable
      columns={[
        { key: 'nombre', label: 'Nombre' },
        { key: 'cantidad', label: 'Tableros' },
        {
          key: 'estado_objeto',
          label: 'Estado',
          render: (value: unknown) => {
            const estado = value as string;
            const colorMap: Record<string, string> = {
              Disponible: '#2d7d46',
              Prestado: '#b45309',
              Dañado: '#b91c1c',
              Incompleto: '#b91c1c',
            };
            return (
              <span
                className="text-secondary"
                style={{ color: colorMap[estado] ?? '#555', fontWeight: 600 }}
              >
                {estado}
              </span>
            );
          },
        },
        { key: 'observacion', label: 'Observación' },
      ]}
      data={inventory}
      onSelect={(row) => {
        onSelectItem(selectedItem?.id === row.id ? null : row);
      }}
      selectedRow={selectedItem ?? undefined}
      emptyMessage="No hay tableros de ajedrez registrados"
    />
  </div>
);
