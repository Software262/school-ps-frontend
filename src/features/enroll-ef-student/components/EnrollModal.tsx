import { DollarSign, Hash } from 'lucide-react';
import { Modal } from '@/shared/ui/atoms/Modal';
import { Button } from '@/shared/ui/atoms/Button';
import { Spinner } from '@/shared/ui/atoms/Spinner';
import type { Program, Period, Student } from '@/features/escuelas-formacion/model/types';
import { useEnrollStudent } from '../hooks/useEnrollStudent';

const MESES = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

interface EnrollModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  programs: Program[];
  periods: Period[];
  onSuccess: (enrollmentId: number) => void;
}

export const EnrollModal = ({
  isOpen,
  onClose,
  student,
  programs,
  periods,
  onSuccess,
}: EnrollModalProps) => {
  const {
    form,
    loading,
    error,
    selectedProgram,
    isGratis,
    canSubmit,
    handleProgramChange,
    handleChange,
    handleSubmit,
    reset,
  } = useEnrollStudent(student, programs, periods, isOpen, onSuccess);

  function handleClose() {
    reset();
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Registrar Inscripción" width={560}>
      {student && (
        <div className="enroll-student-banner">
          <div className="enroll-student-banner-label">Estudiante seleccionado</div>
          <div className="enroll-student-banner-name">{student.nombre}</div>
          <div className="enroll-student-banner-doc">CC: {student.documento}</div>
        </div>
      )}

      {error && <div className="alert alert-error">{error}</div>}

      <form
        id="form-enroll-student"
        onSubmit={(e) => {
          e.preventDefault();
          void handleSubmit();
        }}
      >
        <div className="enroll-form-grid">
          <div className="form-group">
            <label className="form-label" htmlFor="enroll-programa">
              Programa <span style={{ color: 'var(--status-red)' }}>*</span>
            </label>
            <select
              id="enroll-programa"
              className="form-input"
              value={form.complementarioId}
              onChange={(e) => {
                handleProgramChange(e.target.value);
              }}
              required
            >
              <option value="">Seleccione programa</option>
              {programs.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.tipo_complementario}
                  {p.valor > 0 ? ` — $${p.valor.toLocaleString('es-CO')}` : ' — Gratuito'}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="enroll-periodo">
              Período académico <span style={{ color: 'var(--status-red)' }}>*</span>
            </label>
            <select
              id="enroll-periodo"
              className="form-input"
              value={form.periodoId}
              onChange={(e) => {
                handleChange('periodoId', e.target.value);
              }}
              required
            >
              <option value="">Seleccione período</option>
              {periods.map((p) => (
                <option key={p.id} value={p.id}>
                  {new Date(p.periodo_electivo).getFullYear()} — Período #{p.id}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="enroll-mes">
              Mes de inicio <span style={{ color: 'var(--status-red)' }}>*</span>
            </label>
            <select
              id="enroll-mes"
              className="form-input"
              value={form.mes}
              onChange={(e) => {
                handleChange('mes', e.target.value);
              }}
              required
            >
              <option value="">Seleccione mes</option>
              {MESES.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="enroll-valor">
              Valor matrícula (COP)
            </label>
            <div className="enroll-input-icon-wrap">
              <DollarSign size={13} className="enroll-input-icon" />
              <input
                id="enroll-valor"
                className="form-input enroll-input-with-icon"
                type="number"
                min={0}
                placeholder="0"
                value={form.valorAcordado}
                onChange={(e) => {
                  handleChange('valorAcordado', e.target.value);
                }}
              />
            </div>
            {selectedProgram && (
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
                {isGratis
                  ? 'Programa gratuito — paz y salvo inmediato'
                  : `Precio base: $${selectedProgram.valor.toLocaleString('es-CO')} — editable`}
              </span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="enroll-comprobante">
              N.° Comprobante Físico
            </label>
            <div className="enroll-input-icon-wrap">
              <Hash size={13} className="enroll-input-icon" />
              <input
                id="enroll-comprobante"
                className="form-input enroll-input-with-icon"
                type="text"
                placeholder="Ej: 2153000000167125"
                maxLength={100}
                value={form.numeroComprobante}
                onChange={(e) => {
                  handleChange('numeroComprobante', e.target.value);
                }}
              />
            </div>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="enroll-obs">
            Observaciones
          </label>
          <textarea
            id="enroll-obs"
            className="form-textarea"
            placeholder="Notas adicionales sobre la inscripción…"
            value={form.observaciones}
            onChange={(e) => {
              handleChange('observaciones', e.target.value);
            }}
            maxLength={400}
            rows={2}
          />
          <span
            style={{
              fontSize: 'var(--font-size-xs)',
              color: 'var(--text-muted)',
              textAlign: 'right',
              display: 'block',
            }}
          >
            {form.observaciones.length}/400
          </span>
        </div>

        <div className="form-actions">
          <Button type="button" variant="secondary" onClick={handleClose} disabled={loading}>
            Cancelar
          </Button>
          <Button
            id="btn-submit-enroll"
            type="submit"
            variant="primary"
            disabled={loading || !canSubmit}
          >
            {loading ? (
              <>
                <Spinner size={14} color="#fff" /> Guardando…
              </>
            ) : (
              'Guardar Inscripción'
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
