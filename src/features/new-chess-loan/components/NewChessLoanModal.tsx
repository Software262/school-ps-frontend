import { useState, type SyntheticEvent } from 'react';
import { createChessBorrow } from '@/features/new-chess-loan/api/create-chess-loan';
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

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    if (!item || !estudianteId.trim()) return;
    try {
      setLoading(true);
      setError('');
      const now = new Date();
      const fmt = (n: number) => n.toString().padStart(2, '0');
      const fecha_salida = [
        String(now.getFullYear()),
        '-',
        fmt(now.getMonth() + 1),
        '-',
        fmt(now.getDate()),
        'T',
        fmt(now.getHours()),
        ':',
        fmt(now.getMinutes()),
        ':',
        fmt(now.getSeconds()),
      ].join('');
      await createChessBorrow({
        inventario_id: item.id,
        estudiante_id: Number(estudianteId),
        fecha_salida,
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

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Nuevo Préstamo de Ajedrez</h3>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>
        {item && (
          <div className="modal-item-info">
            Tablero: <strong>{item.nombre}</strong> (Stock: {item.cantidad})
          </div>
        )}
        {error && <div className="error-alert">{error}</div>}
        <form
          onSubmit={(e) => {
            void handleSubmit(e);
          }}
          className="modal-body"
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
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading || !estudianteId.trim()}
            >
              {loading ? 'Creando...' : 'Registrar Préstamo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
