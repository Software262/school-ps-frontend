import { useState } from 'react';
import { resolveChessReturn } from '@/features/chess/api/chessApi';
import type { ChessLoan } from '@/features/chess/model/types';

interface Props {
  isOpen: boolean;
  loan: ChessLoan | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const ResolveChessLoanModal = ({ isOpen, loan, onClose, onSuccess }: Props) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const handleResolve = async () => {
    if (!loan) return;
    try {
      setLoading(true);
      setError('');
      await resolveChessReturn(loan.id);
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
            <div className="modal-body" style={{ textAlign: 'center', padding: '1.5rem 0' }}>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                El estudiante ha repuesto el material faltante.
              </p>
              <p style={{ color: 'var(--text-secondary)' }}>
                Se marcará como completo y se liberará el paz y salvo.
              </p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
                Cancelar
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={() => {
                  void handleResolve();
                }}
                disabled={loading}
              >
                {loading ? 'Procesando...' : 'Confirmar Reposición'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
