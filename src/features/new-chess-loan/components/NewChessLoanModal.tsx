import { useState, type SyntheticEvent } from 'react';
import { createChessBorrow } from '@/features/new-chess-loan/api/create-chess-loan';
import type { ChessInventory } from '@/features/chess/model/types';
import { Modal, Spinner } from '@/shared/ui';
import { Button } from '@/shared/ui/atoms/Button';
import { Input } from '@/shared/ui/atoms/Input';

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

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nuevo Préstamo de Ajedrez" width={450}>
      {item && (
        <div className="modal-item-info">
          Tablero: <strong>{item.nombre}</strong> (Stock: {item.cantidad})
        </div>
      )}
      {error && <div className="alert alert-error">{error}</div>}
      <form
        onSubmit={(e) => {
          void handleSubmit(e);
        }}
        style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
      >
        <Input
          label="ID del Estudiante"
          type="number"
          value={estudianteId}
          onChange={(e) => {
            setEstudianteId(e.target.value);
          }}
          required
          disabled={loading}
          placeholder="Ej: 12345"
        />
        <Input
          label="Cantidad"
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
        <Input
          label="Observación"
          type="text"
          value={observacion}
          onChange={(e) => {
            setObservacion(e.target.value);
          }}
          disabled={loading}
          placeholder="Opcional"
        />
        <div className="form-actions">
          <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={loading || !estudianteId.trim()}>
            {loading ? (
              <>
                <Spinner size={14} color="white" /> Creando...
              </>
            ) : (
              'Registrar Préstamo'
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
