import { Modal } from '@/shared/ui/atoms/Modal';
import { Button } from '@/shared/ui/atoms/Button';
import { Spinner } from '@/shared/ui/atoms/Spinner';
import type { Enrollment } from '@/features/escuelas-formacion/model/types';
import { usePayEnrollment } from '../hooks/usePayEnrollment';

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
  const { monto, setMonto, loading, error, montoNum, saldo, exceeds, handleSubmit, reset } =
    usePayEnrollment(enrollment, onSuccess);

  function handleClose() {
    reset();
    onClose();
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

      <form
        id="form-register-payment"
        onSubmit={(e) => {
          e.preventDefault();
          void handleSubmit();
        }}
      >
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
          <Button type="button" variant="secondary" onClick={handleClose} disabled={loading}>
            Cancelar
          </Button>
          <Button
            id="btn-submit-payment"
            type="submit"
            variant="primary"
            disabled={loading || !monto || exceeds || montoNum <= 0}
          >
            {loading ? (
              <>
                <Spinner size={14} color="#fff" /> Registrando…
              </>
            ) : (
              'Registrar Pago'
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
