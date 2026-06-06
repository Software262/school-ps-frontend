import { useState, type SubmitEvent } from 'react';
import { Modal } from '@/shared/ui/atoms/Modal';
import { Spinner } from '@/shared/ui/atoms/Spinner';
import { registerPayment } from '../api/escuelasFormacionApi';
import { RESPONSABLE_USUARIO_ID } from '../model/constants';
import type { Enrollment } from '../model/types';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  enrollment: Enrollment | null;
  studentName: string;
  programName: string;
  onSuccess: (enrollmentId: number) => void;
}

export const PaymentModal = ({
  isOpen,
  onClose,
  enrollment,
  studentName,
  programName,
  onSuccess,
}: PaymentModalProps) => {
  const [monto, setMonto] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function reset() {
    setMonto('');
    setError(null);
  }

  function handleClose() {
    reset();
    onClose();
  }

  const montoNum = Number(monto);
  const saldo = enrollment?.saldo_pendiente ?? 0;
  const exceeds = montoNum > saldo;

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!enrollment) return;
    setError(null);
    setLoading(true);
    try {
      await registerPayment({
        enrollment_id: enrollment.id,
        monto: montoNum,
        usuario_id: RESPONSABLE_USUARIO_ID,
      });
      reset();
      // parent refreshes the list and opens the printable receipt for this record
      onSuccess(enrollment.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrar el pago');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Registrar Pago" width={460}>
      {enrollment && (
        <div
          style={{
            padding: '10px 14px',
            background: 'var(--info-bg)',
            border: '1px solid var(--info-border)',
            borderRadius: 'var(--radius-md)',
            marginBottom: 16,
            fontSize: 'var(--font-size-sm)',
            color: 'var(--info-text)',
          }}
        >
          <div>
            <strong>{studentName}</strong>
          </div>
          <div style={{ marginTop: 2 }}>
            Programa: {programName} — Saldo pendiente:{' '}
            <strong>${saldo.toLocaleString('es-CO')}</strong>
          </div>
        </div>
      )}

      {error && <div className="alert alert-error">{error}</div>}

      <form id="form-register-payment" onSubmit={(e) => void handleSubmit(e)}>
        <div className="form-group">
          <label className="form-label" htmlFor="pay-monto">
            Monto a pagar (COP) <span style={{ color: 'var(--status-red)' }}>*</span>
          </label>
          <input
            id="pay-monto"
            className="form-input"
            type="number"
            min={1}
            max={saldo}
            placeholder={`Máximo $${saldo.toLocaleString('es-CO')}`}
            value={monto}
            onChange={(e) => {
              setMonto(e.target.value);
            }}
            required
          />
          {exceeds && monto !== '' && (
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--status-red)' }}>
              El monto supera el saldo pendiente
            </span>
          )}
          {!exceeds && monto !== '' && montoNum === saldo && (
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--status-green)' }}>
              Pago total — se otorgará paz y salvo
            </span>
          )}
        </div>

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
            id="btn-submit-payment"
            type="submit"
            className="btn btn-primary"
            disabled={loading || !monto || exceeds || montoNum <= 0}
          >
            {loading ? <Spinner size={14} color="#fff" /> : null}
            {loading ? 'Registrando…' : 'Registrar Pago'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
