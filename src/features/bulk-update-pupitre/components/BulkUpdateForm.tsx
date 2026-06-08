import { useState } from 'react';
import { Button } from '@/shared/ui/atoms/Button';
import { Modal } from '@/shared/ui/atoms/Modal';
import { useBulkUpdatePupitre } from '../hooks/useBulkUpdatePupitre';

interface BulkUpdateFormProps {
  grado_id: number;
  grado_nombre: string;
  onCancelar: () => void;
  onExito: (total: number) => void;
}

export const BulkUpdateForm = ({
  grado_id,
  grado_nombre,
  onCancelar,
  onExito,
}: BulkUpdateFormProps) => {
  const [estado, setEstado] = useState<boolean>(true);
  const [observacion, setObservacion] = useState('');
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const { loading, error, ejecutarBulkUpdate } = useBulkUpdatePupitre();

  const handleGuardar = () => {
    setMostrarConfirmacion(true);
  };

  const handleConfirmar = async () => {
    const result = await ejecutarBulkUpdate(grado_id, estado, observacion || null);
    if (result) {
      setMostrarConfirmacion(false);
      onExito(result.total_actualizados);
    }
  };

  return (
    <>
      <div className="card" style={{ marginTop: '24px' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>
          Actualizar Curso Completo — {grado_nombre}
        </h3>

        <p style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '8px' }}>Estado</p>
        <div style={{ display: 'flex', gap: '24px', marginBottom: '16px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input
              type="radio"
              name="estado-bulk"
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
              name="estado-bulk"
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
          placeholder="Ej. Revisión general del curso..."
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
            style={{ backgroundColor: '#f97316' }}
            onClick={handleGuardar}
            disabled={loading}
          >
            Actualizar Todo
          </Button>
        </div>
      </div>

      {/* Modal de confirmación */}
      <Modal
        isOpen={mostrarConfirmacion}
        onClose={() => {
          setMostrarConfirmacion(false);
        }}
        title="Confirmar actualización masiva"
      >
        <p style={{ marginBottom: '24px', color: '#4b5563' }}>
          ¿Está seguro que desea actualizar el estado de <strong>TODOS</strong> los pupitres del
          curso <strong>{grado_nombre}</strong> a <strong>{estado ? 'Bueno' : 'Malo'}</strong>?
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
            style={{ backgroundColor: '#f97316' }}
            onClick={() => {
              void handleConfirmar();
            }}
            disabled={loading}
          >
            {loading ? 'Actualizando...' : 'Confirmar'}
          </Button>
        </div>
      </Modal>
    </>
  );
};
