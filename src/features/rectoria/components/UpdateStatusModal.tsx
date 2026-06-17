import { useState, useEffect, type SubmitEvent } from 'react';
import { Modal, Spinner } from '@/shared/ui';
import type { Teacher } from '@/entities/teacher/model/types';
import { updateStatus } from '../api/rectoriaApi';

interface UpdateStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacher: Teacher | null;
  onSuccess: () => void;
}

export const UpdateStatusModal = ({
  isOpen,
  onClose,
  teacher,
  onSuccess,
}: UpdateStatusModalProps) => {
  const [motivo, setMotivo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pre-fill with existing motivo when modal opens
  useEffect(() => {
    if (isOpen && teacher?.status) {
      const motivo = teacher.status.motivo_estado;
      setTimeout(() => {
        setMotivo(motivo);
      }, 0);
    }
  }, [isOpen, teacher]);

  function reset() {
    setMotivo('');
    setError(null);
  }

  function handleClose() {
    reset();
    onClose();
  }

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!teacher?.status) return;
    setError(null);
    setLoading(true);
    try {
      await updateStatus(teacher.status.id, {
        motivo_estado: motivo.trim(),
      });
      reset();
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar el estado');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Actualizar Estado Administrativo"
      width={480}
    >
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

      <form id="form-update-status" onSubmit={(e) => void handleSubmit(e)}>
        <div className="form-group">
          <label className="form-label" htmlFor="us-motivo">
            Nuevo motivo del estado <span style={{ color: 'var(--status-red)' }}>*</span>
          </label>
          <textarea
            id="us-motivo"
            className="form-textarea"
            placeholder="Actualice el motivo del estado administrativo…"
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
            id="btn-submit-update-status"
            type="submit"
            className="btn btn-primary"
            disabled={loading || !motivo.trim()}
          >
            {loading ? <Spinner size={14} color="#fff" /> : null}
            {loading ? 'Guardando…' : 'Actualizar Estado'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
