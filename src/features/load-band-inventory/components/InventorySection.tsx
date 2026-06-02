import { DataTable } from '@shared/ui/molecules/DataTable';
import { Badge } from '@shared/ui/atoms/Badge';
import type { Inventory } from '@/entities/inventory/model/types';
import {
  getEstadoVariant,
  getEstadoLabel,
  INVENTORY_COLUMNS,
} from '@/entities/inventory/model/inventory-utils';

interface InventorySectionProps {
  inventory: Inventory[];
  searchTerm: string;
  currentPage: number;
  totalPages: number;
  onSearchChange: (term: string) => void;
  onPageChange: (page: number) => void;
}

export const InventorySection = ({
  inventory,
  searchTerm,
  currentPage,
  totalPages,
  onSearchChange,
  onPageChange,
}: InventorySectionProps) => {
  const itemsPerPage = 10;

  // Filtrar instrumentos
  const filteredInstruments = inventory.filter(
    (instrument) =>
      instrument.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instrument.observacion.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Paginar
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredInstruments.slice(startIndex, startIndex + itemsPerPage);

  // Mapear columnas con renders personalizados
  const columnsWithRenders = INVENTORY_COLUMNS.map((col) => {
    if (col.key === 'estado_objeto') {
      return {
        ...col,
        render: (value: unknown) => (
          <Badge variant={getEstadoVariant(String(value))}>{getEstadoLabel(String(value))}</Badge>
        ),
      };
    }
    return col;
  });

  return (
    <div className="table-section">
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
      </div>
      <DataTable<Inventory>
        columns={columnsWithRenders}
        data={paginatedData}
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
            title="Página anterior"
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
            title="Página siguiente"
          >
            Siguiente →
          </button>
        </div>
      )}
    </div>
  );
};
