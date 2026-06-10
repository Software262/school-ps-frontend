import { useState } from 'react';
import { Button } from '@/shared/ui/atoms/Button';
import { Modal } from '@/shared/ui/atoms/Modal';
import { useUpdatePupitre } from '../hooks/useUpdatePupitre';

interface UpdatePupitreFormProps {
  isOpen: boolean;
  estudiante_id: number;
  nombre: string;
  estadoActual: boolean;
  onCancelar: () => void;
  onExito: (nuevoEstado: boolean) => void;
}

export const UpdatePupitreForm = ({
  isOpen,
  estudiante_id,
  nombre,
  estadoActual,
  onCancelar,
  onExito,
}: UpdatePupitreFormProps) => {
  const [estado, setEstado] = useState<boolean>(estadoActual);
  const [observacion, setObservacion] = useState('');
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const { loading, error, ejecutarUpdate } = useUpdatePupitre();

  const handleGuardar = () => {
    setMostrarConfirmacion(true);
  };

  const handleConfirmar = async () => {
    const result = await ejecutarUpdate(estudiante_id, estado, observacion || null);
    if (result) {
      setMostrarConfirmacion(false);
      setObservacion('');
      onExito(estado);
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onCancelar}
        title={`Actualizar Estado del Pupitre — ${nombre}`}
        width={500}
      >
        <p style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '8px' }}>Estado</p>
        <div style={{ display: 'flex', gap: '24px', marginBottom: '16px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input
              type="radio"
              name="estado"
              checked={estado}
              onChange={() => {
                setEstado(true);
              }}
            />
            Bueno
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input
              type="radio"
              name="estado"
              checked={!estado}
              onChange={() => {
                setEstado(false);
              }}
            />
            Malo
          </label>
        </div>

        <p style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '8px' }}>Observación</p>
        <input
          type="text"
          placeholder="Ej. Silla coja, Pupitre rayado, Falta tornillo base."
          value={observacion}
          onChange={(e) => {
            setObservacion(e.target.value);
          }}
          style={{
            width: '100%',
            padding: '10px 12px',
            borderRadius: 'var(--radius-md, 8px)',
            border: '1px solid var(--border)',
            fontSize: '1rem',
            marginBottom: '16px',
            boxSizing: 'border-box',
          }}
        />

        {error && (
          <div
            style={{
              marginBottom: '16px',
              padding: '12px',
              borderRadius: '6px',
              backgroundColor: 'var(--status-red-bg)',
              color: 'var(--status-red)',
              fontSize: '0.875rem',
            }}
          >
            {error}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <Button variant="outline" onClick={onCancelar} disabled={loading}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            style={{ backgroundColor: '#7f1d1d' }}
            onClick={handleGuardar}
            disabled={loading}
          >
            Guardar
          </Button>
        </div>
      </Modal>

      <Modal
        isOpen={mostrarConfirmacion}
        onClose={() => {
          setMostrarConfirmacion(false);
        }}
        title="Confirmar cambio de estado"
        width={400}
      >
        <p style={{ marginBottom: '24px', color: '#4b5563' }}>
          ¿Está seguro que desea cambiar el estado del pupitre de <strong>{nombre}</strong> a{' '}
          <strong>{estado ? 'Bueno' : 'Malo'}</strong>?
        </p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <Button
            variant="outline"
            onClick={() => {
              setMostrarConfirmacion(false);
            }}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            style={{ backgroundColor: '#7f1d1d' }}
            onClick={() => {
              void handleConfirmar();
            }}
            disabled={loading}
          >
            {loading ? 'Guardando...' : 'Confirmar'}
          </Button>
        </div>
      </Modal>
    </>
  );
};
