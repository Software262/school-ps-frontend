import { useState } from 'react';
import { useUpdatePupitre } from '../hooks/useUpdatePupitre';

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(amount);

interface UpdatePupitreFormProps {
  isOpen: boolean;
  estudiante_id: number;
  nombre: string;
  estadoActual: string;
  valorComplementario?: number;
  onCancelar: () => void;
  onExito: () => void;
}

export const UpdatePupitreForm = ({
  estudiante_id,
  nombre,
  estadoActual,
  valorComplementario,
  onCancelar,
  onExito,
}: UpdatePupitreFormProps) => {
  const [observacion, setObservacion] = useState('');
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const { loading, error, ejecutarUpdate } = useUpdatePupitre();

  const esPagado = estadoActual === 'pagado';
  const titulo = esPagado ? 'Marcar como Pendiente' : 'Confirmar Pago';
  const placeholderObservacion = esPagado
    ? 'Ej. Pago registrado por error'
    : 'Ej. Pago recibido, recibo #4521';

  const handleConfirmar = async () => {
    const result = await ejecutarUpdate(estudiante_id, observacion || null);
    if (result) {
      setMostrarConfirmacion(false);
      onExito();
    }
  };

  return (
    <>
      <div className="card" style={{ marginTop: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>
          {titulo} de Pupitre — {nombre}
        </h3>

        {!esPagado && valorComplementario !== undefined && (
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Valor a pagar: <strong>{formatCurrency(valorComplementario)}</strong>
          </p>
        )}

        <div className="input-group">
          <label>Observación (opcional)</label>
          <input
            type="text"
            placeholder={placeholderObservacion}
            value={observacion}
            onChange={(e) => {
              setObservacion(e.target.value);
            }}
          />
        </div>

        {error && <div className="error-alert">{error}</div>}

        <div
          className="modal-footer"
          style={{ borderTop: 'none', marginTop: '8px', paddingTop: 0, gap: '12px' }}
        >
          <button type="button" className="btn-secondary" onClick={onCancelar} disabled={loading}>
            Cancelar
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={() => {
              setMostrarConfirmacion(true);
            }}
            disabled={loading}
          >
            {titulo}
          </button>
        </div>
      </div>

      {mostrarConfirmacion && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ width: '380px', textAlign: 'center' }}>
            <h3 style={{ marginBottom: '0.75rem' }}>{titulo}</h3>
            <p
              style={{
                color: 'var(--text-secondary)',
                fontSize: '0.875rem',
                marginBottom: '1.5rem',
              }}
            >
              {esPagado ? (
                <>
                  ¿Está seguro que desea marcar a <strong>{nombre}</strong> como{' '}
                  <strong>pendiente de pago</strong>?
                </>
              ) : (
                <>
                  ¿Está seguro que desea confirmar el pago de mantenimiento de pupitre para{' '}
                  <strong>{nombre}</strong>?
                </>
              )}
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                type="button"
                className="btn-secondary"
                style={{ flex: 1 }}
                onClick={() => {
                  setMostrarConfirmacion(false);
                }}
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn-primary"
                style={{ flex: 1, justifyContent: 'center' }}
                onClick={() => void handleConfirmar()}
                disabled={loading}
              >
                {loading ? 'Procesando...' : 'Sí, Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
