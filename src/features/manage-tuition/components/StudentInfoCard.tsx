import type { TuitionAccountResponse } from '@/entities/tuition/model/types';

interface StudentInfoCardProps {
  accountData: TuitionAccountResponse;
  studentName?: string;
  studentDocument?: string;
  studentGrado?: string;
  studentEstado?: string;
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(amount);

export const StudentInfoCard = ({
  accountData,
  studentName,
  studentDocument,
  studentGrado,
  studentEstado,
}: StudentInfoCardProps) => (
  <div className="card student-info">
    <div className="info-item">
      <span className="info-label">Estudiante</span>
      <span className="info-value">
        {studentName ?? `ID: ${String(accountData.estudiante_id)}`}
        {studentDocument !== undefined && (
          <span style={{ display: 'block', fontSize: '0.85em', color: 'var(--text-muted)' }}>
            C.C. {studentDocument}
          </span>
        )}
      </span>
    </div>
    <div className="info-item">
      <span className="info-label">Grado / Estado</span>
      <span className="info-value" style={{ textTransform: 'capitalize' }}>
        {studentGrado ?? 'N/A'}
        {studentEstado !== undefined && (
          <span
            style={{
              display: 'inline-block',
              marginLeft: '8px',
              fontSize: '0.75em',
              padding: '2px 8px',
              borderRadius: '12px',
              backgroundColor:
                studentEstado === 'activo' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
              color: studentEstado === 'activo' ? '#22c55e' : '#ef4444',
            }}
          >
            {studentEstado}
          </span>
        )}
      </span>
    </div>
    <div className="info-item">
      <span className="info-label">Estado Global</span>
      <span className="info-value">
        {accountData.estado_pension_general ? 'Paz y Salvo' : 'Pendiente'}
      </span>
    </div>
    <div className="info-item">
      <span className="info-label">Valor de la Mensualidad</span>
      <span className="info-value">{formatCurrency(accountData.valor_total_anual)}</span>
    </div>
  </div>
);
