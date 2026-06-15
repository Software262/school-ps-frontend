import { useState } from 'react';
import { Modal } from '@/shared/ui/atoms/Modal';
import { Button } from '@/shared/ui/atoms/Button';
import { Spinner } from '@/shared/ui/atoms/Spinner';
import type { Complementario, TipoComplementario } from '../model/types';

interface ComplementarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  tipos: TipoComplementario[];
  editing: Complementario | null;
  onSubmit: (data: {
    nombre: string;
    anio: number;
    valor: number;
    estadoComplemento: string;
    tipoComplementarioId: number;
  }) => Promise<void>;
}

const currentYear = new Date().getFullYear();

export const ComplementarioModal = ({
  isOpen,
  onClose,
  tipos,
  editing,
  onSubmit,
}: ComplementarioModalProps) => {
  const [nombre, setNombre] = useState(() => editing?.nombre ?? '');
  const [anio, setAnio] = useState(() => String(editing?.anio ?? currentYear));
  const [valor, setValor] = useState(() => (editing ? String(editing.valor) : ''));
  const [estadoComplemento, setEstadoComplemento] = useState(
    () => editing?.estado_complemento ?? 'Activo',
  );
  const [tipoId, setTipoId] = useState(() => editing?.tipo_complementario_id.toString() ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    setLoading(true);
    setError(null);
    try {
      await onSubmit({
        nombre: nombre.trim(),
        anio: Number(anio),
        valor: Number(valor),
        estadoComplemento: estadoComplemento.trim(),
        tipoComplementarioId: Number(tipoId),
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar el complementario');
    } finally {
      setLoading(false);
    }
  }

  const isValid =
    nombre.trim().length >= 2 &&
    tipoId !== '' &&
    valor !== '' &&
    Number(valor) >= 0 &&
    Number(valor) <= 2_147_483_647;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editing ? 'Editar complementario' : 'Nuevo complementario'}
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
          <label className="form-label" htmlFor="comp-nombre">
            Nombre <span style={{ color: 'var(--status-red)' }}>*</span>
          </label>
          <input
            id="comp-nombre"
            className="form-input"
            type="text"
            placeholder="Ej: Escuela de Baloncesto"
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
          <label className="form-label" htmlFor="comp-tipo">
            Tipo de complementario <span style={{ color: 'var(--status-red)' }}>*</span>
          </label>
          <select
            id="comp-tipo"
            className="form-input"
            value={tipoId}
            onChange={(e) => {
              setTipoId(e.target.value);
            }}
            required
          >
            <option value="">Seleccione un tipo</option>
            {tipos.map((t) => (
              <option key={t.id} value={t.id}>
                {t.padre_nombre ? `${t.padre_nombre} / ${t.nombre}` : t.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="comp-anio">
            Año <span style={{ color: 'var(--status-red)' }}>*</span>
          </label>
          <input
            id="comp-anio"
            className="form-input"
            type="number"
            min={2000}
            value={anio}
            onChange={(e) => {
              setAnio(e.target.value);
            }}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="comp-valor">
            Valor (COP) <span style={{ color: 'var(--status-red)' }}>*</span>
          </label>
          <input
            id="comp-valor"
            className="form-input"
            type="number"
            min={0}
            max={2_147_483_647}
            placeholder="Ej: 60000"
            value={valor}
            onChange={(e) => {
              setValor(e.target.value);
            }}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="comp-estado">
            Estado <span style={{ color: 'var(--status-red)' }}>*</span>
          </label>
          <select
            id="comp-estado"
            className="form-input"
            value={estadoComplemento}
            onChange={(e) => {
              setEstadoComplemento(e.target.value);
            }}
            required
          >
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </div>

        <div className="form-actions">
          <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={loading || !isValid}>
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
