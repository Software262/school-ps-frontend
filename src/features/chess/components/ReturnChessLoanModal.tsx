import { useState } from 'react';
import { Modal } from '@/shared/ui/atoms/Modal';
import { returnChessBorrow } from '@/features/chess/api/chessApi';
import type { ChessLoan } from '@/features/chess/model/types';

interface Props {
  isOpen: boolean;
  loan: ChessLoan | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const ReturnChessLoanModal = ({ isOpen, loan, onClose, onSuccess }: Props) => {
  const [piezasDevueltas, setPiezasDevueltas] = useState(32);
  const [relojFunciona, setRelojFunciona] = useState(true);
  const [observacion, setObservacion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!loan) return;
    try {
      setLoading(true);
      setError('');
      await returnChessBorrow(loan.id, {
        inventario_id: loan.inventario_id,
        estudiante_id: loan.estudiante_id,
        piezas_devueltas: piezasDevueltas,
        reloj_funciona: relojFunciona,
        observacion,
      });
      setPiezasDevueltas(32);
      setRelojFunciona(true);
      setObservacion('');
      onSuccess();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al devolver préstamo');
    } finally {
      setLoading(false);
    }
  };

  const incomplete = piezasDevueltas < 32 || !relojFunciona;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Devolver Material de Ajedrez" width={520}>
      {loan && (
        <p
          style={{
            fontSize: 'var(--font-size-sm)',
            color: 'var(--text-secondary)',
            marginBottom: '1rem',
          }}
        >
          Préstamo #{loan.id} — <strong>{loan.nombre_articulo}</strong>
        </p>
      )}
      {error && (
        <div className="error-alert" style={{ marginBottom: '1rem' }}>
          {error}
        </div>
      )}
      {incomplete && (
        <div
          style={{
            backgroundColor: 'var(--status-red-bg)',
            border: '1px solid var(--status-red-border)',
            borderRadius: 'var(--radius-md)',
            padding: '0.75rem 1rem',
            marginBottom: '1rem',
            fontSize: 'var(--font-size-sm)',
            color: 'var(--status-red)',
          }}
        >
          ⚠ El material está incompleto o dañado. Se generará una novedad y se bloqueará el paz y
          salvo del estudiante.
        </div>
      )}
      <form
        onSubmit={(e) => {
          void handleSubmit(e);
        }}
      >
        <div className="input-group">
          <label>Piezas Devueltas (máx 32)</label>
          <input
            type="number"
            value={piezasDevueltas}
            onChange={(e) => {
              setPiezasDevueltas(Number(e.target.value));
            }}
            min={0}
            max={32}
            required
            disabled={loading}
          />
        </div>
        <div className="input-group" style={{ marginTop: '1rem' }}>
          <label>¿El reloj funciona correctamente?</label>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
            <label
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
            >
              <input
                type="radio"
                checked={relojFunciona}
                onChange={() => {
                  setRelojFunciona(true);
                }}
                disabled={loading}
              />
              Sí
            </label>
            <label
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
            >
              <input
                type="radio"
                checked={!relojFunciona}
                onChange={() => {
                  setRelojFunciona(false);
                }}
                disabled={loading}
              />
              No
            </label>
          </div>
        </div>
        <div className="input-group" style={{ marginTop: '1rem' }}>
          <label>Observación</label>
          <textarea
            value={observacion}
            onChange={(e) => {
              setObservacion(e.target.value);
            }}
            required
            disabled={loading}
            placeholder="Describa el estado del material devuelto"
            rows={2}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              backgroundColor: 'var(--input-bg)',
              border: '1px solid var(--input-border)',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--font-size-md)',
              outline: 'none',
              resize: 'vertical',
            }}
          />
        </div>
        <div className="modal-footer" style={{ marginTop: '1.5rem', paddingTop: '1rem' }}>
          <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
            Cancelar
          </button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Procesando...' : 'Confirmar Devolución'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
