import { useState } from 'react';
import { Modal } from '@/shared/ui/atoms/Modal';
import { createChessBorrow } from '@/features/chess/api/chessApi';
import type { ChessInventory } from '@/features/chess/model/types';

interface Props {
  isOpen: boolean;
  item: ChessInventory | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const NewChessLoanModal = ({ isOpen, item, onClose, onSuccess }: Props) => {
  const [estudianteId, setEstudianteId] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [observacion, setObservacion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!item || !estudianteId.trim()) return;
    try {
      setLoading(true);
      setError('');
      await createChessBorrow({
        inventario_id: item.id,
        estudiante_id: Number(estudianteId),
        cantidad,
        observacion: observacion || undefined,
      });
      setEstudianteId('');
      setCantidad(1);
      setObservacion('');
      onSuccess();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al crear préstamo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nuevo Préstamo de Ajedrez">
      {item && (
        <p
          style={{
            fontSize: 'var(--font-size-sm)',
            color: 'var(--text-secondary)',
            marginBottom: '1rem',
          }}
        >
          Tablero: <strong>{item.nombre}</strong> (Stock: {item.cantidad})
        </p>
      )}
      {error && (
        <div className="error-alert" style={{ marginBottom: '1rem' }}>
          {error}
        </div>
      )}
      <form
        onSubmit={(e) => {
          void handleSubmit(e);
        }}
      >
        <div className="input-group">
          <label>ID del Estudiante</label>
          <input
            type="number"
            value={estudianteId}
            onChange={(e) => {
              setEstudianteId(e.target.value);
            }}
            required
            disabled={loading}
            placeholder="Ej: 12345"
          />
        </div>
        <div className="input-group" style={{ marginTop: '1rem' }}>
          <label>Cantidad</label>
          <input
            type="number"
            value={cantidad}
            onChange={(e) => {
              setCantidad(Number(e.target.value));
            }}
            min={1}
            max={item?.cantidad ?? 1}
            required
            disabled={loading}
          />
        </div>
        <div className="input-group" style={{ marginTop: '1rem' }}>
          <label>Observación</label>
          <input
            type="text"
            value={observacion}
            onChange={(e) => {
              setObservacion(e.target.value);
            }}
            disabled={loading}
            placeholder="Opcional"
          />
        </div>
        <div className="modal-footer" style={{ marginTop: '1.5rem', paddingTop: '1rem' }}>
          <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
            Cancelar
          </button>
          <button type="submit" className="btn-primary" disabled={loading || !estudianteId.trim()}>
            {loading ? 'Creando...' : 'Registrar Préstamo'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
