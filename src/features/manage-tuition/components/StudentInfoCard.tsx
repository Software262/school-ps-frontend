import type { TuitionAccountResponse } from '@/entities/tuition/model/types';

interface StudentInfoCardProps {
  accountData: TuitionAccountResponse;
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(amount);

export const StudentInfoCard = ({ accountData }: StudentInfoCardProps) => (
  <div className="card student-info">
    <div className="info-item">
      <span className="info-label">ID Estudiante</span>
      <span className="info-value">{accountData.estudiante_id}</span>
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
