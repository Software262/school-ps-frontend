import type { TuitionInstallmentResponse } from '@/entities/tuition/model/types';

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(amount);

interface TuitionSummaryProps {
  installments: TuitionInstallmentResponse[];
}

export const TuitionSummary = ({ installments }: TuitionSummaryProps) => (
  <div className="card">
    <div className="summary-header">
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      Resumen Financiero
    </div>
    <div className="summary-cards">
      <div className="summary-card green">
        <div className="summary-label">Total Pagado</div>
        <div className="summary-value">
          {formatCurrency(installments.reduce((sum, i) => sum + i.total_pagado_mes, 0))}
        </div>
        <div className="summary-desc">
          {installments.filter((i) => !i.faltante).length} meses completos
        </div>
      </div>
      <div className="summary-card yellow">
        <div className="summary-label">Pagos Parciales</div>
        <div className="summary-value">
          {installments.filter((i) => i.faltante && i.total_pagado_mes > 0).length}
        </div>
        <div className="summary-desc">Meses con abonos</div>
      </div>
      <div className="summary-card red">
        <div className="summary-label">Saldo Pendiente Total</div>
        <div className="summary-value">
          {formatCurrency(installments.reduce((sum, i) => sum + i.saldo_pendiente, 0))}
        </div>
        <div className="summary-desc">
          {installments.filter((i) => i.faltante).length} cuotas pendientes
        </div>
      </div>
    </div>
  </div>
);
