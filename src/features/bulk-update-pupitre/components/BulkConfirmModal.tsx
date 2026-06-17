import type { SelectedStudent } from '@/features/bulk-update-pupitre/types';

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(amount);

interface BulkConfirmModalProps {
  estudiantes: SelectedStudent[];
  valorUnitario: number;
  loading: boolean;
  onCancelar: () => void;
  onConfirmar: () => void;
}

export const BulkConfirmModal = ({
  estudiantes,
  valorUnitario,
  loading,
  onCancelar,
  onConfirmar,
}: BulkConfirmModalProps) => {
  const total = estudiantes.length * valorUnitario;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Confirmar pago de pupitres</h3>
          <button className="close-btn" onClick={onCancelar} disabled={loading}>
            ✕
          </button>
        </div>
        <div className="modal-body">
          <p style={{ marginBottom: '12px', color: 'var(--text-secondary)' }}>
            Se confirmará el pago de mantenimiento de pupitre para los siguientes{' '}
            <strong>{estudiantes.length}</strong> estudiante(s):
          </p>

          <ul className="bulk-list">
            {estudiantes.map((e) => (
              <li key={e.estudiante_id}>
                <span style={{ color: 'var(--text-muted)', minWidth: '90px' }}>{e.documento}</span>
                <span style={{ flex: 1, textAlign: 'left', paddingLeft: '12px' }}>
                  {e.nombre_estudiante}
                </span>
                <span style={{ color: 'var(--text-muted)' }}>{e.grado}</span>
              </li>
            ))}
          </ul>

          <p style={{ fontSize: '0.95rem', margin: 0 }}>
            Valor unitario: <strong>{formatCurrency(valorUnitario)}</strong>
          </p>
          <p className="bulk-total">Total: {formatCurrency(total)}</p>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn-secondary" onClick={onCancelar} disabled={loading}>
            Cancelar
          </button>
          <button type="button" className="btn-primary" onClick={onConfirmar} disabled={loading}>
            {loading ? 'Procesando...' : 'Confirmar Pagos'}
          </button>
        </div>
      </div>
    </div>
  );
};
