import type { TuitionInstallmentResponse } from '@/entities/tuition/model/types';

const MONTH_NAMES = [
  '',
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(amount);

const getStatusInfo = (installment: TuitionInstallmentResponse) => {
  if (!installment.faltante) return { label: 'Pagado', className: 'pagado', color: 'text-green' };
  if (installment.total_pagado_mes > 0)
    return { label: 'Pago Parcial', className: 'parcial', color: 'text-red' };
  return { label: 'Pendiente', className: 'pendiente', color: 'text-red' };
};

interface InstallmentsGridProps {
  installments: TuitionInstallmentResponse[];
  onEditInstallment: (installment: TuitionInstallmentResponse) => void;
}

export const InstallmentsGrid = ({ installments, onEditInstallment }: InstallmentsGridProps) => (
  <div className="card">
    <div className="installments-section-header">
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
      Estado Mensual - Vista Semaforizada
    </div>

    <div className="installments-grid">
      {installments.map((instData) => {
        const status = getStatusInfo(instData);

        return (
          <div key={`mes-card-${instData.mes.toString()}`} className="installment-card">
            <div className="installment-header">
              <span className="installment-month">{MONTH_NAMES[instData.mes]}</span>
              <div className="badge-container">
                <span className={`status-badge ${status.className}`}>{status.label}</span>
                {instData.faltante && (
                  <button
                    className="edit-btn"
                    onClick={() => onEditInstallment(instData)}
                    title="Registrar Pago o Ajuste"
                  >
                    <svg
                      width="16"
                      height="16"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>
            <div className="installment-details">
              <div className="detail-row">
                <span>Valor cuota:</span>
                <span>{formatCurrency(instData.valor_total)}</span>
              </div>
              <div className="detail-row">
                <span>Pagado acumulado:</span>
                <span>{formatCurrency(instData.total_pagado_mes)}</span>
              </div>
              <div className={`detail-row saldo ${status.color}`}>
                <span>Saldo:</span>
                <span>{formatCurrency(instData.saldo_pendiente)}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);
