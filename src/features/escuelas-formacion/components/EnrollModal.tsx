import { useState, useEffect, type SubmitEvent } from 'react';
import { DollarSign, Hash } from 'lucide-react';
import { Modal } from '@/shared/ui/atoms/Modal';
import { Spinner } from '@/shared/ui/atoms/Spinner';
import { enrollStudent } from '../api/escuelasFormacionApi';
import { RESPONSABLE_USUARIO_ID } from '../model/constants';
import type { Period, Program, Student } from '../model/types';

interface EnrollModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  programs: Program[];
  periods: Period[];
  onSuccess: (enrollmentId: number) => void;
}

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

export const EnrollModal = ({
  isOpen,
  onClose,
  student,
  programs,
  periods,
  onSuccess,
}: EnrollModalProps) => {
  const [complementarioId, setComplementarioId] = useState('');
  const [periodoId, setPeriodoId] = useState('');
  const [mes, setMes] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [valorAcordado, setValorAcordado] = useState('');
  const [numeroComprobante, setNumeroComprobante] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedProgram = programs.find((p) => p.id === Number(complementarioId));

  // set the program and pre-fill its base price (still editable afterwards)
  function handleProgramChange(value: string) {
    setComplementarioId(value);
    const prog = programs.find((p) => p.id === Number(value));
    setValorAcordado(prog ? String(prog.valor) : '');
  }

  // auto-select first period when the modal opens (deferred to keep the effect body pure)
  useEffect(() => {
    if (!isOpen || periods.length === 0 || periodoId) return;
    const t = setTimeout(() => {
      setPeriodoId(String(periods[0].id));
    }, 0);
    return () => {
      clearTimeout(t);
    };
  }, [isOpen, periods, periodoId]);

  function reset() {
    setComplementarioId('');
    setPeriodoId('');
    setMes('');
    setObservaciones('');
    setValorAcordado('');
    setNumeroComprobante('');
    setError(null);
  }

  function handleClose() {
    reset();
    onClose();
  }

  const valorNum = Number(valorAcordado);
  const isGratis = valorNum === 0;

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!student) return;
    setError(null);
    setLoading(true);
    try {
      const created = await enrollStudent({
        estudiante_id: student.id,
        complementario_id: Number(complementarioId),
        periodo_id: Number(periodoId),
        mes,
        usuario_id: RESPONSABLE_USUARIO_ID,
        observaciones: observaciones.trim() || undefined,
        valor_acordado: valorNum,
        numero_comprobante: numeroComprobante.trim() || undefined,
      });
      reset();
      // parent refreshes the list and opens the printable receipt for this record
      onSuccess(created.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al inscribir el estudiante');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Registrar Inscripción" width={560}>
      {/* student info banner */}
      {student && (
        <div className="enroll-student-banner">
          <div className="enroll-student-banner-label">Estudiante seleccionado</div>
          <div className="enroll-student-banner-name">{student.nombre}</div>
          <div className="enroll-student-banner-doc">CC: {student.documento}</div>
        </div>
      )}

      {error && <div className="alert alert-error">{error}</div>}

      <form id="form-enroll-student" onSubmit={(e) => void handleSubmit(e)}>
        <div className="enroll-form-grid">
          {/* programa */}
          <div className="form-group">
            <label className="form-label" htmlFor="enroll-programa">
              Programa <span style={{ color: 'var(--status-red)' }}>*</span>
            </label>
            <select
              id="enroll-programa"
              className="form-input"
              value={complementarioId}
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

          {/* período */}
          <div className="form-group">
            <label className="form-label" htmlFor="enroll-periodo">
              Período académico <span style={{ color: 'var(--status-red)' }}>*</span>
            </label>
            <select
              id="enroll-periodo"
              className="form-input"
              value={periodoId}
              onChange={(e) => {
                setPeriodoId(e.target.value);
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

          {/* mes */}
          <div className="form-group">
            <label className="form-label" htmlFor="enroll-mes">
              Mes de inicio <span style={{ color: 'var(--status-red)' }}>*</span>
            </label>
            <select
              id="enroll-mes"
              className="form-input"
              value={mes}
              onChange={(e) => {
                setMes(e.target.value);
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

          {/* valor matrícula */}
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
                value={valorAcordado}
                onChange={(e) => {
                  setValorAcordado(e.target.value);
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

          {/* comprobante físico */}
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
                value={numeroComprobante}
                onChange={(e) => {
                  setNumeroComprobante(e.target.value);
                }}
              />
            </div>
          </div>
        </div>

        {/* observaciones full-width */}
        <div className="form-group">
          <label className="form-label" htmlFor="enroll-obs">
            Observaciones
          </label>
          <textarea
            id="enroll-obs"
            className="form-textarea"
            placeholder="Notas adicionales sobre la inscripción…"
            value={observaciones}
            onChange={(e) => {
              setObservaciones(e.target.value);
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
            {observaciones.length}/400
          </span>
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
            id="btn-submit-enroll"
            type="submit"
            className="btn btn-primary"
            disabled={loading || !complementarioId || !periodoId || !mes}
          >
            {loading ? <Spinner size={14} color="#fff" /> : null}
            {loading ? 'Guardando…' : 'Guardar Inscripción'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
