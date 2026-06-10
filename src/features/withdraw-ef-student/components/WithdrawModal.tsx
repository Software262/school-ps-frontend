import { CalendarDays, LogOut, User, AlertTriangle } from 'lucide-react';
import { Modal } from '@/shared/ui/atoms/Modal';
import { Button } from '@/shared/ui/atoms/Button';
import { Spinner } from '@/shared/ui/atoms/Spinner';
import type { Enrollment } from '@/features/escuelas-formacion/model/types';
import { useWithdrawStudent, MOTIVOS } from '../hooks/useWithdrawStudent';
import './WithdrawModal.css';

function money(value: number): string {
  return `$${value.toLocaleString('es-CO')}`;
}

function fmt(iso: string): string {
  return new Date(iso).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  enrollment: Enrollment | null;
  studentName: string;
  programName: string;
  onSuccess: () => void;
}

export const WithdrawModal = ({
  isOpen,
  onClose,
  enrollment,
  studentName,
  programName,
  onSuccess,
}: WithdrawModalProps) => {
  const {
    motivoReason,
    setMotivoReason,
    customReason,
    setCustomReason,
    observaciones,
    setObservaciones,
    loading,
    error,
    isOtro,
    canSubmit,
    hoy,
    handleSubmit,
    reset,
  } = useWithdrawStudent(enrollment, onSuccess, onClose);

  function handleClose() {
    reset();
    onClose();
  }

  if (!enrollment) return null;

  const tieneSaldo = enrollment.saldo_pendiente > 0;
  const abonado = enrollment.valor_acordado - enrollment.saldo_pendiente;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Retirar Estudiante" width={620}>
      {error && <div className="alert alert-error">{error}</div>}

      <form
        id="form-withdraw-student"
        onSubmit={(e) => {
          e.preventDefault();
          void handleSubmit();
        }}
      >
        <section className="wd-section">
          <header className="wd-section-header">
            <User size={14} />
            <span>Estudiante seleccionado</span>
          </header>
          <div className="wd-detail-grid">
            <div className="wd-detail">
              <span className="wd-detail-label">Estudiante</span>
              <span className="wd-detail-value">{studentName}</span>
            </div>
            <div className="wd-detail">
              <span className="wd-detail-label">Documento</span>
              <span className="wd-detail-value">{enrollment.estudiante_documento}</span>
            </div>
            <div className="wd-detail">
              <span className="wd-detail-label">Programa activo</span>
              <span className="wd-detail-value">{programName}</span>
            </div>
            <div className="wd-detail">
              <span className="wd-detail-label">Grado</span>
              <span className="wd-detail-value">{enrollment.estudiante_grado}</span>
            </div>
            <div className="wd-detail">
              <span className="wd-detail-label">Mes de inicio</span>
              <span className="wd-detail-value">{enrollment.mes}</span>
            </div>
            <div className="wd-detail">
              <span className="wd-detail-label">Inscripción</span>
              <span className="wd-detail-value">{fmt(enrollment.fecha_registro)}</span>
            </div>
          </div>
        </section>

        <section className="wd-section">
          <header className="wd-section-header">
            <span>Resumen de la obligación</span>
          </header>
          <div className="wd-money-grid">
            <div className="wd-money">
              <span className="wd-money-label">Valor matrícula</span>
              <span className="wd-money-value">{money(enrollment.valor_acordado)}</span>
            </div>
            <div className="wd-money">
              <span className="wd-money-label">Abonado</span>
              <span className="wd-money-value wd-money-value--green">{money(abonado)}</span>
            </div>
            <div className="wd-money">
              <span className="wd-money-label">Saldo pendiente</span>
              <span
                className={`wd-money-value ${tieneSaldo ? 'wd-money-value--red' : 'wd-money-value--green'}`}
              >
                {money(enrollment.saldo_pendiente)}
              </span>
            </div>
          </div>
          {tieneSaldo && (
            <div className="wd-warning">
              <AlertTriangle size={14} />
              <span>
                El estudiante tiene saldo pendiente. Verifique el cobro hasta el mes en curso antes
                de cerrar el retiro.
              </span>
            </div>
          )}
        </section>

        <section className="wd-section">
          <header className="wd-section-header">
            <LogOut size={14} />
            <span>Información de retiro</span>
          </header>
          <div className="wd-form-grid">
            <div className="form-group">
              <label className="form-label" htmlFor="wd-fecha">
                Fecha de retiro
              </label>
              <div className="wd-date-readonly">
                <CalendarDays size={13} />
                <span>{hoy}</span>
              </div>
              <span className="wd-hint">Se registra con la fecha de hoy.</span>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="wd-motivo">
                Motivo del retiro <span style={{ color: 'var(--status-red)' }}>*</span>
              </label>
              <select
                id="wd-motivo"
                className="form-input"
                value={motivoReason}
                onChange={(e) => {
                  setMotivoReason(e.target.value);
                }}
                required
              >
                <option value="">Seleccione un motivo</option>
                {MOTIVOS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {isOtro && (
            <div className="form-group">
              <label className="form-label" htmlFor="wd-custom">
                Especifique el motivo <span style={{ color: 'var(--status-red)' }}>*</span>
              </label>
              <input
                id="wd-custom"
                className="form-input"
                type="text"
                placeholder="Describa el motivo del retiro (mínimo 5 caracteres)"
                value={customReason}
                onChange={(e) => {
                  setCustomReason(e.target.value);
                }}
                maxLength={200}
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="wd-obs">
              Observaciones finales
            </label>
            <textarea
              id="wd-obs"
              className="form-textarea"
              placeholder="Notas adicionales sobre el retiro (opcional)…"
              value={observaciones}
              onChange={(e) => {
                setObservaciones(e.target.value);
              }}
              maxLength={300}
              rows={2}
            />
          </div>
        </section>

        <div className="form-actions">
          <Button type="button" variant="secondary" onClick={handleClose} disabled={loading}>
            Cancelar
          </Button>
          <Button
            id="btn-submit-withdraw"
            type="submit"
            variant="primary"
            disabled={loading || !canSubmit}
          >
            {loading ? (
              <>
                <Spinner size={14} color="#fff" /> Registrando…
              </>
            ) : (
              <>
                <LogOut size={14} /> Confirmar Retiro
              </>
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
