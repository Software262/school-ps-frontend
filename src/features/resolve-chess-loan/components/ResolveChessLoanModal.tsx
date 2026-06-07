import { useState, type SyntheticEvent } from 'react';
import { resolveChessBorrowNovelty } from '@/features/resolve-chess-loan/api/resolve-chess-loan';
import type { ChessLoan } from '@/features/chess/model/types';

interface Props {
  isOpen: boolean;
  loan: ChessLoan | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const ResolveChessLoanModal = ({ isOpen, loan, onClose, onSuccess }: Props) => {
  const [notas, setNotas] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const handleResolve = async (e: SyntheticEvent) => {
    e.preventDefault();
    if (!loan) return;
    try {
      setLoading(true);
      setError('');
      await resolveChessBorrowNovelty(loan.id, {
        notas_resolucion: notas,
        usuario_auditoria_id: 1,
      });
      setNotas('');
      setDone(true);
      onSuccess();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al reponer material');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Reponer Material de Ajedrez</h3>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {done ? (
          <>
            <div className="modal-body" style={{ textAlign: 'center', padding: '2rem 0' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--status-green)' }}>
                ✓
              </div>
              <h3
                style={{
                  fontSize: 'var(--font-size-lg)',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  marginBottom: '0.5rem',
                }}
              >
                Material Repuesto
              </h3>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                El material ha sido repuesto. Paz y Salvo liberado para el estudiante.
              </p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn-primary"
                onClick={() => {
                  setDone(false);
                  onClose();
                }}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Aceptar
              </button>
            </div>
          </>
        ) : (
          <>
            {loan && (
              <div className="modal-item-info">
                Préstamo #{loan.id} — <strong>{loan.nombre_articulo}</strong> —{' '}
                {loan.nombre_estudiante}
              </div>
            )}
            {error && <div className="error-alert">{error}</div>}
            <form
              onSubmit={(e) => {
                void handleResolve(e);
              }}
              className="modal-body"
            >
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                El estudiante ha repuesto el material faltante. Describa los detalles de la
                reposición.
              </p>
              <div className="input-group">
                <label>Notas de Reposición</label>
                <textarea
                  value={notas}
                  onChange={(e) => {
                    setNotas(e.target.value);
                  }}
                  required
                  disabled={loading}
                  placeholder="Detalle cómo se repuso el material (mín. 5 caracteres)"
                  rows={3}
                  className="form-textarea"
                />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={onClose}
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading || notas.length < 5}
                >
                  {loading ? 'Procesando...' : 'Confirmar Reposición'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
