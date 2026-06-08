import { useState, type SubmitEvent } from 'react';
import { CalendarDays, LogOut, User, AlertTriangle } from 'lucide-react';
import { Modal } from '@/shared/ui/atoms/Modal';
import { Spinner } from '@/shared/ui/atoms/Spinner';
import { withdrawStudent } from '../api/escuelasFormacionApi';
import { RESPONSABLE_USUARIO_ID } from '../model/constants';
import type { Enrollment } from '../model/types';
import './WithdrawModal.css';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  enrollment: Enrollment | null;
  studentName: string;
  programName: string;
  onSuccess: () => void;
}

// predefined reasons keep the traceability field consistent across withdrawals
const MOTIVOS = [
  'Retiro voluntario',
  'Cambio de institución',
  'Motivos económicos',
  'Bajo rendimiento o desempeño',
  'Motivos de salud',
  'Finalización del programa',
  'Otro',
];

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

export const WithdrawModal = ({
  isOpen,
  onClose,
  enrollment,
  studentName,
  programName,
  onSuccess,
}: WithdrawModalProps) => {
  const [motivoReason, setMotivoReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // captured once so render stays pure (no new Date() during render)
  const [hoy] = useState(() =>
    new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' }),
  );

  const isOtro = motivoReason === 'Otro';
  const baseReason = isOtro ? customReason.trim() : motivoReason;
  // the api stores a single motivo field; fold the optional note into it for traceability
  const finalMotivo = observaciones.trim() ? `${baseReason} — ${observaciones.trim()}` : baseReason;
  const canSubmit = baseReason.length >= 5 && finalMotivo.length >= 5;

  function reset() {
    setMotivoReason('');
    setCustomReason('');
    setObservaciones('');
    setError(null);
  }

  function handleClose() {
    reset();
    onClose();
  }

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!enrollment || !canSubmit) return;
    setError(null);
    setLoading(true);
    try {
      await withdrawStudent({
        enrollment_id: enrollment.id,
        motivo: finalMotivo,
        usuario_id: RESPONSABLE_USUARIO_ID,
      });
      reset();
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrar el retiro');
    } finally {
      setLoading(false);
    }
  }

  if (!enrollment) return null;

  const tieneSaldo = enrollment.saldo_pendiente > 0;
  const abonado = enrollment.valor_acordado - enrollment.saldo_pendiente;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Retirar Estudiante" width={620}>
      {error && <div className="alert alert-error">{error}</div>}

      <form id="form-withdraw-student" onSubmit={(e) => void handleSubmit(e)}>
        {/* selected student details */}
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

        {/* obligation summary (this module is single-obligation, not monthly pension) */}
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

        {/* withdrawal info */}
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
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleClose}
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            id="btn-submit-withdraw"
            type="submit"
            className="btn btn-primary"
            disabled={loading || !canSubmit}
          >
            {loading ? <Spinner size={14} color="#fff" /> : <LogOut size={14} />}
            {loading ? 'Registrando…' : 'Confirmar Retiro'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
