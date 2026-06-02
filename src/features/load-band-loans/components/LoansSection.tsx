import { DataTable } from '@shared/ui/molecules/DataTable';
import { Badge } from '@shared/ui/atoms/Badge';
import type { LoanFormatted } from '../hooks/useLoansFilters';
import type { LoansFilterType } from '../hooks/useLoansFilters';

interface LoansSectionProps {
  loans: LoanFormatted[];
  searchTerm: string;
  filter: LoansFilterType;
  currentPage: number;
  totalPages: number;
  onSearchChange: (term: string) => void;
  onFilterChange: (filter: LoansFilterType) => void;
  onPageChange: (page: number) => void;
}

const LOAN_COLUMNS = [
  {
    key: 'nombreEstudiante',
    label: 'NOMBRE DEL ESTUDIANTE',
  },
  {
    key: 'nombreInstrumento',
    label: 'NOMBRE DEL INSTRUMENTO',
  },
  {
    key: 'cantidad',
    label: 'CANTIDAD',
  },
  {
    key: 'fechaPrestamo',
    label: 'FECHA PRÉSTAMO',
  },
  {
    key: 'fechaDevolucion',
    label: 'FECHA DEVOLUCIÓN',
    render: (value: unknown) => {
      const fecha = value as string | null;
      return fecha ?? <span className="text-secondary">Pendiente</span>;
    },
  },
  {
    key: 'enPrestamo',
    label: 'EN PRÉSTAMO',
    render: (value: unknown) => {
      const enPrestamo = Boolean(value);
      return <Badge variant={enPrestamo ? 'yellow' : 'green'}>{enPrestamo ? 'SÍ' : 'No'}</Badge>;
    },
  },
  {
    key: 'observacion',
    label: 'OBSERVACIÓN',
  },
];

export const LoansSection = ({
  loans,
  searchTerm,
  filter,
  currentPage,
  totalPages,
  onSearchChange,
  onFilterChange,
  onPageChange,
}: LoansSectionProps) => {
  const itemsPerPage = 10;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = loans.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="loans-section">
      <div className="loans-header">
        <div className="loans-header-buttons">
          <button className="btn-return-loan">Retornar Préstamo</button>
          <button className="btn-new-loan">Nuevo Préstamo</button>
        </div>
      </div>
      <div className="table-filters">
        <input
          type="text"
          placeholder="Buscar por estudiante o instrumento..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => {
            onSearchChange(e.target.value);
          }}
        />
        <div className="filter-buttons">
          <button
            className={`filter-btn ${filter === 'all' ? 'filter-btn-active' : ''}`}
            onClick={() => {
              onFilterChange('all');
            }}
          >
            Todos
          </button>
          <button
            className={`filter-btn ${filter === 'active' ? 'filter-btn-active' : ''}`}
            onClick={() => {
              onFilterChange('active');
            }}
          >
            Activos
          </button>
          <button
            className={`filter-btn ${filter === 'inactive' ? 'filter-btn-active' : ''}`}
            onClick={() => {
              onFilterChange('inactive');
            }}
          >
            Inactivos
          </button>
        </div>
      </div>
      <DataTable<LoanFormatted>
        columns={LOAN_COLUMNS}
        data={paginatedData}
        emptyMessage="No se encontraron préstamos"
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
