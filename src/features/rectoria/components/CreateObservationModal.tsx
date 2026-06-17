import { useState, type SubmitEvent } from 'react';
import { Modal, Spinner } from '@/shared/ui';
import { getSessionUser } from '@/shared/auth/session';
import { createObservation } from '@/features/rectoria/api/rectoriaApi';
import type { Teacher } from '@/entities/teacher/model/types';

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

export const CreateObservationModal = ({
  isOpen,
  onClose,
  teacher,
  onSuccess,
}: CreateObservationModalProps) => {
  const [descripcion, setDescripcion] = useState('');
  const [tipoObservacion, setTipoObservacion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function reset() {
    setDescripcion('');
    setTipoObservacion('');
    setError(null);
  }

  function handleClose() {
    reset();
    onClose();
  }

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!teacher) return;

    setError(null);
    setLoading(true);
    try {
      const user = getSessionUser();
      if (!user) throw new Error('Sesión no encontrada');
      await createObservation({
        docente_id: teacher.id,
        id_usuario: user.id,
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
    <Modal isOpen={isOpen} onClose={handleClose} title="Agregar Observación" width={480}>
      {teacher && (
        <p
          style={{
            fontSize: 'var(--font-size-sm)',
            color: 'var(--text-muted)',
            marginBottom: 16,
          }}
        >
          Docente: <strong style={{ color: 'var(--text-primary)' }}>{teacher.nombre}</strong>
        </p>
      )}

      {error && <div className="alert alert-error">{error}</div>}

      <form id="form-create-observation" onSubmit={(e) => void handleSubmit(e)}>
        <div className="form-group">
          <label className="form-label" htmlFor="co-tipo">
            Tipo de observación <span style={{ color: 'var(--status-red)' }}>*</span>
          </label>
          <select
            id="co-tipo"
            className="form-input"
            value={tipoObservacion}
            onChange={(e) => {
              setTipoObservacion(e.target.value);
            }}
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
            onChange={(e) => {
              setDescripcion(e.target.value);
            }}
            minLength={3}
            maxLength={400}
            required
          />
          <span
            style={{
              fontSize: 'var(--font-size-xs)',
              color: 'var(--text-muted)',
              textAlign: 'right',
            }}
          >
            {descripcion.length}/400
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
            id="btn-submit-observation"
            type="submit"
            className="btn btn-primary"
            disabled={loading || !descripcion.trim() || !tipoObservacion}
          >
            {loading ? <Spinner size={14} color="#fff" /> : null}
            {loading ? 'Guardando…' : 'Registrar Observación'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
