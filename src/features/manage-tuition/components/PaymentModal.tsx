import { useState, type SubmitEvent } from 'react';
import type { TuitionInstallmentResponse } from '@/entities/tuition/model/types';
import type { PaymentCreateRequest } from '@/entities/tuition/model/types';

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

interface PaymentModalProps {
  selectedMonth: TuitionInstallmentResponse;
  estudianteId: number;
  onClose: () => void;
  onPaymentSuccess: () => Promise<void>;
  submitPayment: (request: PaymentCreateRequest) => Promise<TuitionInstallmentResponse>;
}

export const PaymentModal = ({
  selectedMonth,
  estudianteId,
  onClose,
  onPaymentSuccess,
  submitPayment,
}: PaymentModalProps) => {
  const [paymentAmount, setPaymentAmount] = useState('');
  const [justification, setJustification] = useState('');
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleFormSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0) return;
    setShowConfirmDialog(true);
  };

  const executePayment = async () => {
    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0) return;

    try {
      setPaymentLoading(true);
      setErrorMsg('');
      await submitPayment({
        estudiante_id: estudianteId,
        mes: selectedMonth.mes,
        valor_pagado: amount,
      });
      setShowConfirmDialog(false);
      await onPaymentSuccess();
      onClose();
    } catch (error: unknown) {
      setErrorMsg(error instanceof Error ? error.message : 'No se pudo registrar el pago.');
      setShowConfirmDialog(false);
    } finally {
      setPaymentLoading(false);
    }
  };

  return (
    <>
      {/* Payment Form Modal */}
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header">
            <h3>Registrar Abono - {MONTH_NAMES[selectedMonth.mes]}</h3>
            <button className="close-btn" onClick={onClose}>
              ✕
            </button>
          </div>
          <form onSubmit={handleFormSubmit} className="modal-body">
            <div className="input-group">
              <label>Valor a pagar o ajustar (COP)</label>
              <input
                type="number"
                value={paymentAmount}
                onChange={(e) => {
                  setPaymentAmount(e.target.value);
                }}
                max={selectedMonth.saldo_pendiente}
                min="1"
                required
                disabled={paymentLoading}
              />
            </div>
            <div className="input-group" style={{ marginTop: '1rem' }}>
              <label>Motivo / Justificación (Obligatorio)</label>
              <textarea
                value={justification}
                onChange={(e) => {
                  setJustification(e.target.value);
                }}
                required
                disabled={paymentLoading}
                placeholder="Ej: Abono en efectivo / Ajuste autorizado"
                rows={2}
                style={{
                  width: '100%',
                  padding: '0.625rem 1rem',
                  borderRadius: '6px',
                  border: '1px solid var(--card-border)',
                  outline: 'none',
                  resize: 'vertical',
                }}
              />
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              Saldo actual: {formatCurrency(selectedMonth.saldo_pendiente)}
            </p>
            <div className="modal-footer">
              <button
                type="button"
                className="btn-secondary"
                onClick={onClose}
                disabled={paymentLoading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={paymentLoading || !paymentAmount}
              >
                Continuar
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Confirm Dialog */}
      {showConfirmDialog && (
        <div className="modal-overlay" style={{ zIndex: 1050 }}>
          <div className="modal-content" style={{ width: '350px', textAlign: 'center' }}>
            <div style={{ marginBottom: '1rem', color: 'var(--status-yellow)' }}>
              <svg
                width="48"
                height="48"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                style={{ margin: '0 auto' }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h3
              style={{
                fontSize: '1.25rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                marginBottom: '0.5rem',
              }}
            >
              Confirmar Abono
            </h3>
            <p
              style={{
                color: 'var(--text-secondary)',
                fontSize: '0.875rem',
                marginBottom: '1.5rem',
              }}
            >
              ¿Está seguro que desea registrar un pago por valor de{' '}
              <strong style={{ color: 'var(--text-primary)' }}>
                {formatCurrency(parseFloat(paymentAmount))}
              </strong>{' '}
              para el mes de <strong>{MONTH_NAMES[selectedMonth.mes]}</strong>?
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  setShowConfirmDialog(false);
                }}
                disabled={paymentLoading}
                style={{ flex: 1 }}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={() => void executePayment()}
                disabled={paymentLoading}
                style={{ flex: 1, justifyContent: 'center' }}
              >
                {paymentLoading ? 'Procesando...' : 'Sí, Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Dialog */}
      {errorMsg && (
        <div className="modal-overlay" style={{ zIndex: 1100 }}>
          <div className="modal-content" style={{ width: '350px', textAlign: 'center' }}>
            <div style={{ marginBottom: '1rem', color: 'var(--status-red)' }}>
              <svg
                width="48"
                height="48"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                style={{ margin: '0 auto' }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3
              style={{
                fontSize: '1.25rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                marginBottom: '0.5rem',
              }}
            >
              No se pudo procesar
            </h3>
            <p
              style={{
                color: 'var(--text-secondary)',
                fontSize: '0.875rem',
                marginBottom: '1.5rem',
              }}
            >
              {errorMsg}
            </p>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button
                type="button"
                className="btn-primary"
                onClick={() => {
                  setErrorMsg('');
                }}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
