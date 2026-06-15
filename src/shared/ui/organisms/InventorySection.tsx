import { DataTable } from '@/shared/ui/molecules/DataTable';
import { INVENTORY_COLUMNS } from '@/entities/inventory/ui/inventory-columns';
import { Button } from '@/shared/ui/atoms/Button';
import type { Inventory } from '@/entities/inventory/model/types';

export interface InventorySectionProps {
  inventory: Inventory[];
  searchTerm: string;
  currentPage: number;
  totalPages: number;
  selectedItem: Inventory | null;
  onSearchChange: (term: string) => void;
  onPageChange: (page: number) => void;
  onSelectItem: (item: Inventory) => void;
  onNewItem: () => void;
  onEditItem: () => void;
  onMaintenance?: () => void;
  onImport?: () => void;
  editLabel?: string;
  newLabel?: string;
  maintenanceLabel?: string;
  importLabel?: string;
  editDisabledTitle?: string;
  emptyMessage?: string;
}

export const InventorySection = ({
  inventory,
  searchTerm,
  currentPage,
  totalPages,
  selectedItem,
  onSearchChange,
  onPageChange,
  onSelectItem,
  onNewItem,
  onEditItem,
  onMaintenance,
  onImport,
  editLabel = 'Editar Ítem',
  newLabel = 'Nuevo Ítem',
  maintenanceLabel = 'Mantenimiento',
  importLabel = 'Importar',
  editDisabledTitle = 'Selecciona un ítem de la tabla para editarlo',
  emptyMessage = 'No se encontraron ítems',
}: InventorySectionProps) => (
  <div className="table-section">
    <div className="inventory-header">
      <div className="inventory-header-buttons">
        {onMaintenance && (
          <Button variant="secondary" onClick={onMaintenance}>
            {maintenanceLabel}
          </Button>
        )}
        {onImport && (
          <Button variant="outline" onClick={onImport}>
            {importLabel}
          </Button>
        )}
        <Button
          variant="ghost"
          onClick={onEditItem}
          disabled={!selectedItem}
          title={!selectedItem ? editDisabledTitle : undefined}
        >
          {editLabel}
        </Button>
        <Button variant="primary" onClick={onNewItem}>
          {newLabel}
        </Button>
      </div>
    </div>

    <div className="table-filters">
      <input
        type="text"
        placeholder="Buscar por nombre u observación..."
        className="search-input"
        value={searchTerm}
        onChange={(e) => {
          onSearchChange(e.target.value);
        }}
      />
      {selectedItem && (
        <span className="inventory-selected-hint">
          ✓ Seleccionado: <strong>{selectedItem.nombre}</strong>
        </span>
      )}
    </div>

    <DataTable<Inventory>
      columns={INVENTORY_COLUMNS}
      data={inventory}
      onSelect={onSelectItem}
      selectedRow={selectedItem ?? undefined}
      emptyMessage={emptyMessage}
    />

    {totalPages > 1 && (
      <div className="pagination-wrapper">
        <button
          className="pagination-btn pagination-btn-prev"
          onClick={() => {
            onPageChange(currentPage - 1);
          }}
          disabled={currentPage === 1}
        >
          ← Anterior
        </button>
        <div className="pagination-info">
          Página <span className="pagination-number">{currentPage}</span> de{' '}
          <span className="pagination-number">{totalPages}</span>
        </div>
        <button
          className="pagination-btn pagination-btn-next"
          onClick={() => {
            onPageChange(currentPage + 1);
          }}
          disabled={currentPage === totalPages}
        >
          Siguiente →
        </button>
      </div>
    )}
  </div>
);
