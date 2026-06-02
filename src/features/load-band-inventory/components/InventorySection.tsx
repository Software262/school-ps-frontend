import { DataTable } from '@/shared/ui';
import { INVENTORY_COLUMNS } from '@/entities/inventory/ui/inventory-columns';
import type { Inventory } from '@/entities/inventory/model/types';

interface InventorySectionProps {
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
}: InventorySectionProps) => {
  return (
    <div className="table-section">
      {/* Header con acciones */}
      <div className="inventory-header">
        <div className="inventory-header-buttons">
          <button
            className="btn-edit-item"
            onClick={onEditItem}
            disabled={!selectedItem}
            title={
              !selectedItem ? 'Selecciona un instrumento de la tabla para editarlo' : undefined
            }
          >
            Editar Instrumento
          </button>
          <button className="btn-new-item" onClick={onNewItem}>
            Nuevo Instrumento
          </button>
        </div>
      </div>

      {/* Filtro de búsqueda */}
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
        emptyMessage="No se encontraron instrumentos"
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
};
