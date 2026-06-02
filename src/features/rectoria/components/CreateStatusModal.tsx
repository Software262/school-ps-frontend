import { useState, type SubmitEvent } from 'react';
import { Modal, Spinner } from '@/shared/ui';
import { createStatus } from '@/features/rectoria/api/rectoriaApi';
import type { Teacher } from '@/entities/teacher/model/types';

interface CreateStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacher: Teacher | null;
  /** Called after successful status creation so the list can refresh */
  onSuccess: () => void;
}

const DEFAULT_USER_ID = 1; // TODO: replace with auth context

export const CreateStatusModal = ({
  isOpen,
  onClose,
  teacher,
  onSuccess,
}: CreateStatusModalProps) => {
  const [periodoId, setPeriodoId] = useState('');
  const [motivo, setMotivo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function reset() {
    setPeriodoId('');
    setMotivo('');
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
      await createStatus({
        docente_id: teacher.id,
        periodo_id: Number(periodoId),
        id_usuario: DEFAULT_USER_ID,
        motivo_estado: motivo.trim(),
      });
      reset();
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear el estado');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Asignar Estado (Paz y Salvo)" width={480}>
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

      <form id="form-create-status" onSubmit={(e) => void handleSubmit(e)}>
        <div className="form-group">
          <label className="form-label" htmlFor="cs-periodo">
            ID de Período <span style={{ color: 'var(--status-red)' }}>*</span>
          </label>
          <input
            id="cs-periodo"
            className="form-input"
            type="number"
            min={1}
            placeholder="Ej: 1"
            value={periodoId}
            onChange={(e) => {
              setPeriodoId(e.target.value);
            }}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="cs-motivo">
            Motivo del estado <span style={{ color: 'var(--status-red)' }}>*</span>
          </label>
          <textarea
            id="cs-motivo"
            className="form-textarea"
            placeholder="Describa el motivo del estado administrativo…"
            value={motivo}
            onChange={(e) => {
              setMotivo(e.target.value);
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
            {motivo.length}/400
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
            id="btn-submit-create-status"
            type="submit"
            className="btn btn-primary"
            disabled={loading || !periodoId || !motivo.trim()}
          >
            {loading ? <Spinner size={14} color="#fff" /> : null}
            {loading ? 'Guardando…' : 'Asignar Estado'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
