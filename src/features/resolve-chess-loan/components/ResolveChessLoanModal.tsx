import { useState, type SyntheticEvent } from 'react';
import { resolveChessBorrowNovelty } from '@/features/resolve-chess-loan/api/resolve-chess-loan';
import type { ChessLoan } from '@/features/chess/model/types';
import { Modal, Spinner } from '@/shared/ui';
import { Button } from '@/shared/ui/atoms/Button';

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

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Reponer Material de Ajedrez" width={450}>
      {done ? (
        <div style={{ textAlign: 'center', padding: '1rem 0' }}>
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
          <p
            style={{
              fontSize: 'var(--font-size-sm)',
              color: 'var(--text-secondary)',
              marginBottom: '1.5rem',
            }}
          >
            El material ha sido repuesto. Paz y Salvo liberado para el estudiante.
          </p>
          <Button
            variant="primary"
            fullWidth
            onClick={() => {
              setDone(false);
              onClose();
            }}
          >
            Aceptar
          </Button>
        </div>
      ) : (
        <>
          {loan && (
            <div className="modal-item-info">
              Préstamo #{loan.id} — <strong>{loan.nombre_articulo}</strong> —{' '}
              {loan.nombre_estudiante}
            </div>
          )}
          {error && <div className="alert alert-error">{error}</div>}
          <form
            onSubmit={(e) => {
              void handleResolve(e);
            }}
            style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
          >
            <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
              El estudiante ha repuesto el material faltante. Describa los detalles de la
              reposición.
            </p>
            <div className="input-container">
              <label className="input-label">Notas de Reposición</label>
              <textarea
                className="input-field"
                style={{ minHeight: '80px', padding: '8px 12px' }}
                value={notas}
                onChange={(e) => {
                  setNotas(e.target.value);
                }}
                required
                disabled={loading}
                placeholder="Detalle cómo se repuso el material (mín. 5 caracteres)"
                rows={3}
              />
            </div>
            <div className="form-actions">
              <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
                Cancelar
              </Button>
              <Button type="submit" variant="primary" disabled={loading || notas.length < 5}>
                {loading ? (
                  <>
                    <Spinner size={14} color="white" /> Procesando...
                  </>
                ) : (
                  'Confirmar Reposición'
                )}
              </Button>
            </div>
          </form>
        </>
      )}
    </Modal>
  );
};
