import { useState, type SyntheticEvent } from 'react';
import { returnChessBorrow } from '@/features/return-chess-loan/api/return-chess-loan';
import type { ChessLoan } from '@/features/chess/model/types';
import { Modal, Spinner } from '@/shared/ui';
import { Button } from '@/shared/ui/atoms/Button';
import { Input } from '@/shared/ui/atoms/Input';

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

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Devolver Material de Ajedrez" width={450}>
      {result ? (
        <div style={{ textAlign: 'center', padding: '1rem 0' }}>
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
          <p
            style={{
              fontSize: 'var(--font-size-sm)',
              color: 'var(--text-secondary)',
              marginBottom: '1.5rem',
            }}
          >
            {result.mensaje}
          </p>
          <Button
            variant="primary"
            fullWidth
            onClick={() => {
              setResult(null);
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
              Préstamo #{loan.id} — <strong>{loan.nombre_articulo}</strong>
            </div>
          )}
          {error && <div className="alert alert-error">{error}</div>}
          {incomplete && (
            <div className="alert alert-error">
              ⚠ El material está incompleto o dañado. Se generará una novedad y se bloqueará el paz
              y salvo del estudiante.
            </div>
          )}
          <form
            onSubmit={(e) => {
              void handleSubmit(e);
            }}
            style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
          >
            <Input
              label="Piezas Devueltas (máx 32)"
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
            <div className="input-container">
              <label className="input-label">Observación</label>
              <textarea
                className="input-field"
                style={{ minHeight: '64px', padding: '8px 12px' }}
                value={observacion}
                onChange={(e) => {
                  setObservacion(e.target.value);
                }}
                disabled={loading}
                placeholder="Describa el estado del material devuelto (opcional si devolución es completa)"
                rows={2}
              />
            </div>
            <div className="form-actions">
              <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
                Cancelar
              </Button>
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner size={14} color="white" /> Procesando...
                  </>
                ) : (
                  'Confirmar Devolución'
                )}
              </Button>
            </div>
          </form>
        </>
      )}
    </Modal>
  );
};
