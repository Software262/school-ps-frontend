import { useState } from 'react';
import { Modal } from '@/shared/ui/atoms/Modal';
import { Button } from '@/shared/ui/atoms/Button';
import { Spinner } from '@/shared/ui/atoms/Spinner';
import type { TipoComplementario } from '../model/types';

interface TipoComplementarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  tipos: TipoComplementario[];
  editing: TipoComplementario | null;
  onSubmit: (
    nombre: string,
    subTipoComplementario: number | null,
    estado: boolean | null,
  ) => Promise<void>;
}

export const TipoComplementarioModal = ({
  isOpen,
  onClose,
  tipos,
  editing,
  onSubmit,
}: TipoComplementarioModalProps) => {
  const [nombre, setNombre] = useState(() => editing?.nombre ?? '');
  const [padreId, setPadreId] = useState(() => editing?.sub_tipo_complementario?.toString() ?? '');
  const [estado, setEstado] = useState(() => editing?.estado ?? true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const posiblesPadres = tipos.filter((t) => t.id !== editing?.id);

  async function handleSubmit() {
    setLoading(true);
    setError(null);
    try {
      await onSubmit(nombre.trim(), padreId ? Number(padreId) : null, editing ? estado : null);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar el tipo');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editing ? 'Editar tipo de complementario' : 'Nuevo tipo de complementario'}
      width={460}
    >
      {error && <div className="alert alert-error">{error}</div>}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void handleSubmit();
        }}
      >
        <div className="form-group">
          <label className="form-label" htmlFor="tipo-nombre">
            Nombre <span style={{ color: 'var(--status-red)' }}>*</span>
          </label>
          <input
            id="tipo-nombre"
            className="form-input"
            type="text"
            placeholder="Ej: Baloncesto"
            value={nombre}
            onChange={(e) => {
              setNombre(e.target.value);
            }}
            minLength={2}
            maxLength={50}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="tipo-padre">
            Tipo padre (opcional)
          </label>
          <select
            id="tipo-padre"
            className="form-input"
            value={padreId}
            onChange={(e) => {
              setPadreId(e.target.value);
            }}
          >
            <option value="">Sin tipo padre</option>
            {posiblesPadres.map((t) => (
              <option key={t.id} value={t.id}>
                {t.nombre}
              </option>
            ))}
          </select>
        </div>

        {editing && (
          <div className="form-group">
            <label className="form-label" htmlFor="tipo-estado">
              Estado <span style={{ color: 'var(--status-red)' }}>*</span>
            </label>
            <select
              id="tipo-estado"
              className="form-input"
              value={estado ? 'Activo' : 'Inactivo'}
              onChange={(e) => {
                setEstado(e.target.value === 'Activo');
              }}
            >
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>
        )}

        <div className="form-actions">
          <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={loading || nombre.trim().length < 2}>
            {loading ? (
              <>
                <Spinner size={14} color="#fff" /> Guardando…
              </>
            ) : (
              'Guardar'
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
