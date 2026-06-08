import { useState, type SyntheticEvent } from 'react';
import { returnChessBorrow } from '@/features/return-chess-loan/api/return-chess-loan';
import type { ChessLoan } from '@/features/chess/model/types';

interface Props {
  isOpen: boolean;
  loan: ChessLoan | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const ReturnChessLoanModal = ({ isOpen, loan, onClose, onSuccess }: Props) => {
  const [piezasDevueltas, setPiezasDevueltas] = useState(32);
  const [observacion, setObservacion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ mensaje: string; novedad_creada: boolean } | null>(null);

  const incomplete = piezasDevueltas < 32;

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    if (!loan) return;
    try {
      setLoading(true);
      setError('');
      const finalObservacion =
        observacion || (piezasDevueltas === 32 ? 'Devuelto en buen estado' : '');
      const res = await returnChessBorrow(loan.id, {
        conteo_piezas: piezasDevueltas,
        observacion: finalObservacion,
      });
      setResult({ mensaje: res.mensaje, novedad_creada: res.novedad_creada });
      setPiezasDevueltas(32);
      setObservacion('');
      onSuccess();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al devolver préstamo');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Devolver Material de Ajedrez</h3>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {result ? (
          <>
            <div className="modal-body" style={{ textAlign: 'center', padding: '2rem 0' }}>
              <div
                style={{
                  fontSize: '3rem',
                  marginBottom: '1rem',
                  color: result.novedad_creada ? 'var(--status-red)' : 'var(--status-green)',
                }}
              >
                {result.novedad_creada ? '⚠' : '✓'}
              </div>
              <h3
                style={{
                  fontSize: 'var(--font-size-lg)',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  marginBottom: '0.5rem',
                }}
              >
                Devolución {result.novedad_creada ? 'Registrada' : 'Exitosa'}
              </h3>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                {result.mensaje}
              </p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn-primary"
                onClick={() => {
                  setResult(null);
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
                Préstamo #{loan.id} — <strong>{loan.nombre_articulo}</strong>
              </div>
            )}
            {error && <div className="error-alert">{error}</div>}
            {incomplete && (
              <div className="error-alert">
                ⚠ El material está incompleto o dañado. Se generará una novedad y se bloqueará el
                paz y salvo del estudiante.
              </div>
            )}
            <form
              onSubmit={(e) => {
                void handleSubmit(e);
              }}
              className="modal-body"
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
                <label>Observación</label>
                <textarea
                  value={observacion}
                  onChange={(e) => {
                    setObservacion(e.target.value);
                  }}
                  disabled={loading}
                  placeholder="Describa el estado del material devuelto (opcional si devolución es completa)"
                  rows={2}
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
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Procesando...' : 'Confirmar Devolución'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
