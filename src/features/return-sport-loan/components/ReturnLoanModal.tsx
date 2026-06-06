import { Modal, Spinner, DataTable } from '@/shared/ui';
import type { LoanFormatted } from '@/entities/loan/model/loan-utils';
import { useReturnLoan } from '../hooks/useReturnLoan';
import './ReturnLoanModal.css';

const RETURN_COLUMNS = [
  { key: 'nombreEstudiante', label: 'ESTUDIANTE' },
  { key: 'nombreInstrumento', label: 'INSTRUMENTO' },
  { key: 'cantidad', label: 'CANT.' },
  { key: 'fechaPrestamo', label: 'FECHA SALIDA' },
  { key: 'observacion', label: 'OBSERVACIÓN' },
];

interface ReturnLoanModalProps {
  isOpen: boolean;
  activeLoans: LoanFormatted[];
  activeLoansTotal: number;
  activeLoansPage: number;
  activeLoansTotalPages: number;
  activeLoansLoading: boolean;
  onActiveLoansPageChange: (page: number) => void;
  onClose: () => void;
  onSuccess: () => void;
}

export const ReturnLoanModal = ({
  isOpen,
  activeLoans,
  activeLoansTotal,
  activeLoansPage,
  activeLoansTotalPages,
  activeLoansLoading,
  onActiveLoansPageChange,
  onClose,
  onSuccess,
}: ReturnLoanModalProps) => {
  const {
    selectedLoan,
    observacion,
    loading,
    error,
    handleSelectLoan,
    handleObservacionChange,
    handleSubmit,
    reset,
  } = useReturnLoan(() => {
    onSuccess();
    onClose();
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Retornar Préstamo" width={680}>
      <div className="return-loan-modal">
        {/* Error general */}
        {error && <div className="alert alert-error">{error}</div>}

        {/* ── Paso 1: Seleccionar préstamo ─────────────────────────────── */}
        <p className="section-title">1. Selecciona el préstamo a retornar</p>

        <div className="active-count">
          Préstamos activos:
          <span className="active-count-badge">{activeLoansTotal}</span>
        </div>

        <div className="loans-table-wrapper">
          {activeLoansLoading ? (
            <div className="empty-state">
              <Spinner size={24} />
              <p>Cargando préstamos activos...</p>
            </div>
          ) : activeLoans.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">✓</div>
              <p>No hay préstamos activos en este momento.</p>
            </div>
          ) : (
            <>
              <DataTable<LoanFormatted>
                columns={RETURN_COLUMNS}
                data={activeLoans}
                onSelect={handleSelectLoan}
                selectedRow={selectedLoan ?? undefined}
                emptyMessage="No hay préstamos activos"
              />

              {activeLoansTotalPages > 1 && (
                <div className="pagination-wrapper">
                  <button
                    className="pagination-btn pagination-btn-prev"
                    onClick={() => {
                      onActiveLoansPageChange(activeLoansPage - 1);
                    }}
                    disabled={activeLoansPage === 1}
                    title="Página anterior"
                  >
                    ← Anterior
                  </button>
                  <div className="pagination-info">
                    Página <span className="pagination-number">{activeLoansPage}</span> de{' '}
                    <span className="pagination-number">{activeLoansTotalPages}</span>
                  </div>
                  <button
                    className="pagination-btn pagination-btn-next"
                    onClick={() => {
                      onActiveLoansPageChange(activeLoansPage + 1);
                    }}
                    disabled={activeLoansPage === activeLoansTotalPages}
                    title="Página siguiente"
                  >
                    Siguiente →
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* ── Paso 2: Confirmar devolución (aparece al seleccionar) ────── */}
        {selectedLoan && (
          <div className="confirm-panel">
            <p className="confirm-panel-title">
              <span>✓</span> Confirmación de devolución
            </p>

            <div className="confirm-grid">
              <div className="confirm-field">
                <span className="confirm-field-label">Estudiante</span>
                <span className="confirm-field-value">{selectedLoan.nombreEstudiante}</span>
              </div>
              <div className="confirm-field">
                <span className="confirm-field-label">Instrumento</span>
                <span className="confirm-field-value">{selectedLoan.nombreInstrumento}</span>
              </div>
              <div className="confirm-field">
                <span className="confirm-field-label">Cantidad prestada</span>
                <span className="confirm-field-value">{selectedLoan.cantidad}</span>
              </div>
              <div className="confirm-field">
                <span className="confirm-field-label">Fecha de salida</span>
                <span className="confirm-field-value">{selectedLoan.fechaPrestamo}</span>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="rl-observacion">
                Observación
              </label>
              <textarea
                id="rl-observacion"
                className="form-textarea"
                placeholder="Notas sobre la devolución (opcional)..."
                rows={2}
                value={observacion}
                onChange={(e) => {
                  handleObservacionChange(e.target.value);
                }}
              />
            </div>
          </div>
        )}

        {/* ── Acciones ─────────────────────────────────────────────────── */}
        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleClose}
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              void handleSubmit();
            }}
            disabled={loading || !selectedLoan || activeLoansTotal === 0}
          >
            {loading ? (
              <>
                <Spinner size={16} color="#fff" /> Guardando…
              </>
            ) : (
              'Confirmar Devolución'
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};
