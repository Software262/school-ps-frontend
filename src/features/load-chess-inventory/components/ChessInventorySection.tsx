import { DataTable } from '@/shared/ui/molecules/DataTable';
import { Button } from '@/shared/ui/atoms/Button';
import type { ChessInventory } from '@/features/chess/model/types';

interface Props {
  inventory: ChessInventory[];
  selectedItem: ChessInventory | null;
  onSelectItem: (item: ChessInventory | null) => void;
  onNewLoan: () => void;
  onNewItem: () => void;
}

export const ChessInventorySection = ({
  inventory,
  selectedItem,
  onSelectItem,
  onNewLoan,
  onNewItem,
}: Props) => (
  <div className="table-section">
    <div className="inventory-header">
      <div className="inventory-header-buttons">
        {selectedItem && (
          <span className="inventory-selected-hint">Seleccionado: {selectedItem.nombre}</span>
        )}
        <Button variant="primary" onClick={onNewItem}>
          + Nuevo Artículo
        </Button>
        <Button variant="primary" onClick={onNewLoan} disabled={!selectedItem}>
          + Nuevo Préstamo
        </Button>
      </div>
    </div>
    <DataTable
      columns={[
        { key: 'nombre', label: 'Nombre' },
        { key: 'cantidad_total', label: 'Cantidad' },
        { key: 'observacion', label: 'Observación' },
      ]}
      data={inventory}
      onSelect={(row) => {
        onSelectItem(selectedItem?.id === row.id ? null : row);
      }}
      selectedRow={selectedItem ?? undefined}
      emptyMessage="No hay artículos de ajedrez registrados"
    />
  </div>
);
