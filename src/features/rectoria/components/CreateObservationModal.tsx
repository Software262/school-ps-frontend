/* eslint-disable */
import React, { useState } from 'react';
import { Modal } from '../../../shared/ui/Modal';
import { Spinner } from '../../../shared/ui/Spinner';
import { createObservation } from '../api/rectoriaApi';
import type { Teacher } from '../../../entities/teacher/model/types';

interface CreateObservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacher: Teacher | null;
  onSuccess: () => void;
}

const OBSERVATION_TYPES = [
  'académica',
  'disciplinaria',
  'ayuda',
  'reconocimiento',
  'administrativa',
  'otra',
];

const DEFAULT_USER_ID = 1;

export const CreateObservationModal: React.FC<CreateObservationModalProps> = ({
  isOpen,
  onClose,
  teacher,
  onSuccess,
}) => {
  const [periodoId, setPeriodoId] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [tipoObservacion, setTipoObservacion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function reset() {
    setPeriodoId('');
    setDescripcion('');
    setTipoObservacion('');
    setError(null);
  }

  function handleClose() {
    reset();
    onClose();
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!teacher) return;
    setError(null);
    setLoading(true);
    try {
      await createObservation({
        docente_id: teacher.id,
        periodo_id: Number(periodoId),
        id_usuario: DEFAULT_USER_ID,
        descripcion: descripcion.trim(),
        tipo_observacion: tipoObservacion.trim(),
      });
      reset();
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrar la observación');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Agregar Observación"
      width={480}
    >
      {teacher && (
        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)', marginBottom: 16 }}>
          Docente: <strong style={{ color: 'var(--text-primary)' }}>{teacher.nombre}</strong>
        </p>
      )}

      {error && <div className="alert alert-error">{error}</div>}

      <form id="form-create-observation" onSubmit={(e) => void handleSubmit(e)}>
        <div className="form-group">
          <label className="form-label" htmlFor="co-periodo">
            ID de Período <span style={{ color: 'var(--status-red)' }}>*</span>
          </label>
          <input
            id="co-periodo"
            className="form-input"
            type="number"
            min={1}
            placeholder="Ej: 1"
            value={periodoId}
            onChange={(e) => { setPeriodoId(e.target.value); }}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="co-tipo">
            Tipo de observación <span style={{ color: 'var(--status-red)' }}>*</span>
          </label>
          <select
            id="co-tipo"
            className="form-input"
            value={tipoObservacion}
            onChange={(e) => { setTipoObservacion(e.target.value); }}
            required
            style={{ cursor: 'pointer' }}
          >
            <option value="">Seleccione un tipo…</option>
            {OBSERVATION_TYPES.map((t) => (
              <option key={t} value={t}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="co-desc">
            Descripción <span style={{ color: 'var(--status-red)' }}>*</span>
          </label>
          <textarea
            id="co-desc"
            className="form-textarea"
            placeholder="Describa la observación con detalle…"
            value={descripcion}
            onChange={(e) => { setDescripcion(e.target.value); }}
            minLength={3}
            maxLength={400}
            required
          />
          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', textAlign: 'right' }}>
            {descripcion.length}/400
          </span>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={handleClose} disabled={loading}>
            Cancelar
          </button>
          <button
            id="btn-submit-observation"
            type="submit"
            className="btn btn-primary"
            disabled={loading || !periodoId || !descripcion.trim() || !tipoObservacion}
          >
            {loading ? <Spinner size={14} color="#fff" /> : null}
            {loading ? 'Guardando…' : 'Registrar Observación'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
