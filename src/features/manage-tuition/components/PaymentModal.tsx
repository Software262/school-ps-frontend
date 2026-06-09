import { useState, type SubmitEvent } from 'react';
import { Modal } from '@/shared/ui/atoms/Modal';
import { Button } from '@/shared/ui/atoms/Button';
import type {
  TuitionInstallmentResponse,
  PaymentCreateRequest,
} from '@/entities/tuition/model/types';

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

  const handleModalClose = () => {
    if (errorMsg) {
      setErrorMsg('');
      return;
    }
    if (showConfirmDialog) {
      setShowConfirmDialog(false);
      return;
    }
    onClose();
  };

  const modalTitle = errorMsg
    ? 'No se pudo procesar'
    : showConfirmDialog
      ? 'Confirmar Abono'
      : `Registrar Abono — ${MONTH_NAMES[selectedMonth.mes]}`;

  return (
    <Modal isOpen onClose={handleModalClose} title={modalTitle} width={450}>
      {errorMsg ? (
        /* ── Error ── */
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: 'var(--status-red)', marginBottom: '1rem' }}>
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
          <p
            style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}
          >
            {errorMsg}
          </p>
          <div className="form-actions" style={{ justifyContent: 'center' }}>
            <Button
              variant="primary"
              onClick={() => {
                setErrorMsg('');
              }}
              style={{ width: '100%' }}
            >
              Entendido
            </Button>
          </div>
        </div>
      ) : showConfirmDialog ? (
        /* ── Confirm ── */
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: 'var(--status-yellow)', marginBottom: '1rem' }}>
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
          <p
            style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}
          >
            ¿Está seguro que desea registrar un pago de{' '}
            <strong style={{ color: 'var(--text-primary)' }}>
              {formatCurrency(parseFloat(paymentAmount))}
            </strong>{' '}
            para <strong>{MONTH_NAMES[selectedMonth.mes]}</strong>?
          </p>
          <div className="form-actions" style={{ justifyContent: 'center' }}>
            <Button
              variant="secondary"
              onClick={() => {
                setShowConfirmDialog(false);
              }}
              disabled={paymentLoading}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                void executePayment();
              }}
              disabled={paymentLoading}
            >
              {paymentLoading ? 'Procesando...' : 'Sí, Confirmar'}
            </Button>
          </div>
        </div>
      ) : (
        /* ── Form ── */
        <form onSubmit={handleFormSubmit}>
          <div className="form-group">
            <label className="form-label">Valor a pagar o ajustar (COP)</label>
            <input
              type="number"
              className="form-input"
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
          <div className="form-group">
            <label className="form-label">Motivo / Justificación (Obligatorio)</label>
            <textarea
              className="form-textarea"
              value={justification}
              onChange={(e) => {
                setJustification(e.target.value);
              }}
              required
              disabled={paymentLoading}
              placeholder="Ej: Abono en efectivo / Ajuste autorizado"
              rows={2}
            />
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            Saldo actual: {formatCurrency(selectedMonth.saldo_pendiente)}
          </p>
          <div className="form-actions">
            <Button type="button" variant="secondary" onClick={onClose} disabled={paymentLoading}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={paymentLoading || !paymentAmount}>
              Continuar
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
