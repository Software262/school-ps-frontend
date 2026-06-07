import { DataTable } from '@/shared/ui';
import { LOAN_COLUMNS } from '@/entities/loan/ui/loan-columns';
import type { LoanFormatted, LoansFilterType } from '@/entities/loan/model/loan-utils';

interface LoansSectionProps {
  /** Elementos ya filtrados y paginados listos para renderizar. */
  loans: LoanFormatted[];
  searchTerm: string;
  filter: LoansFilterType;
  currentPage: number;
  totalPages: number;
  onSearchChange: (term: string) => void;
  onFilterChange: (filter: LoansFilterType) => void;
  onPageChange: (page: number) => void;
  onNewLoan: () => void;
  onReturnLoan?: () => void;
}

export const LoansSection = ({
  loans,
  searchTerm,
  filter,
  currentPage,
  totalPages,
  onSearchChange,
  onFilterChange,
  onPageChange,
  onNewLoan,
  onReturnLoan,
}: LoansSectionProps) => {
  return (
    <div className="loans-section">
      <div className="loans-header">
        <div className="loans-header-buttons">
          <button className="btn-return-loan" onClick={onReturnLoan} disabled={!onReturnLoan}>
            Retornar Préstamo
          </button>
          <button className="btn-new-loan" onClick={onNewLoan}>
            Nuevo Préstamo
          </button>
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
        data={loans}
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
