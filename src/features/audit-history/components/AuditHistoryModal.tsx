import { useState, useEffect, useCallback } from 'react';
import { Calendar, Loader, Receipt, AlertCircle } from 'lucide-react';
import { Modal } from '@/shared/ui/atoms/Modal';
import { Button } from '@/shared/ui/atoms/Button';
import { getPaymentHistory } from '../api/auditApi';
import type { PaymentHistoryItem } from '../types';
import { PaymentReceiptModal } from './PaymentReceiptModal';

interface AuditHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentId: number;
  studentName: string;
}

export const AuditHistoryModal = ({
  isOpen,
  onClose,
  studentId,
  studentName,
}: AuditHistoryModalProps) => {
  const [payments, setPayments] = useState<PaymentHistoryItem[]>([]);
  const [year, setYear] = useState(() => new Date().getFullYear());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Receipt modal state
  const [selectedPagoId, setSelectedPagoId] = useState<number | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  const fetchHistory = useCallback(async () => {
    if (!studentId) return;
    try {
      setLoading(true);
      setError(null);
      const data = await getPaymentHistory(studentId, year);
      setPayments(data);
    } catch (err: unknown) {
      console.error(err);
      const msg =
        err instanceof Error
          ? err.message
          : 'No se pudo cargar el historial de pagos del estudiante.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [studentId, year]);

  useEffect(() => {
    if (isOpen && studentId) {
      const timer = setTimeout(() => {
        void fetchHistory();
      }, 0);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [isOpen, studentId, fetchHistory]);

  const handleOpenReceipt = (pagoId: number) => {
    setSelectedPagoId(pagoId);
    setIsReceiptOpen(true);
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={`Historial de Pagos - ${studentName}`}
        width={700}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Filters Bar */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#f8fafc',
              padding: '12px 16px',
              borderRadius: '8px',
              border: '1px solid var(--border)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: 'var(--text-muted)',
              }}
            >
              <Calendar size={18} />
              <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Filtrar por año lectivo</span>
            </div>
            <select
              value={year}
              onChange={(e) => {
                setYear(Number(e.target.value));
              }}
              disabled={loading}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: '1px solid var(--border)',
                backgroundColor: '#fff',
                fontSize: '0.875rem',
                color: 'var(--text-main)',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              {[2024, 2025, 2026, 2027].map((y) => (
                <option key={y} value={y}>
                  Año {y}
                </option>
              ))}
            </select>
          </div>

          {/* Error Message */}
          {error && (
            <div
              style={{
                padding: '12px',
                borderRadius: '6px',
                backgroundColor: 'var(--status-red-bg)',
                color: 'var(--status-red)',
                fontSize: '0.875rem',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          {/* Payments Table */}
          <div className="table-container" style={{ margin: 0 }}>
            <table className="data-table" style={{ fontSize: '0.875rem' }}>
              <thead>
                <tr>
                  <th>Fecha de Pago</th>
                  <th>N° de Tirilla / Talonario</th>
                  <th>Monto Pagado</th>
                  <th>Observación</th>
                  <th style={{ textAlign: 'center', width: '150px' }}>Comprobante</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '24px 0' }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                        }}
                      >
                        <Loader className="animate-spin" size={16} color="var(--brand-primary)" />
                        <span>Cargando historial de pagos...</span>
                      </div>
                    </td>
                  </tr>
                ) : payments.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-muted)' }}
                    >
                      No se encontraron abonos ni pagos registrados para este año lectivo.
                    </td>
                  </tr>
                ) : (
                  payments.map((p) => (
                    <tr key={p.id}>
                      <td>{formatDate(p.fecha_pago)}</td>
                      <td style={{ fontWeight: 600 }}>{p.codigo_talonario}</td>
                      <td style={{ fontWeight: 600, color: 'var(--status-green)' }}>
                        ${p.monto_total.toLocaleString()}
                      </td>
                      <td
                        style={{
                          color: p.observacion ? 'var(--text-main)' : 'var(--text-muted)',
                          fontSize: '0.8rem',
                        }}
                      >
                        {p.observacion ?? 'Sin observación'}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            handleOpenReceipt(p.id);
                          }}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '4px 10px',
                            fontSize: '0.8rem',
                          }}
                        >
                          <Receipt size={14} />
                          Ver Recibo
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
            <Button variant="secondary" onClick={onClose}>
              Cerrar
            </Button>
          </div>
        </div>
      </Modal>

      {/* Embedded receipt modal */}
      {selectedPagoId !== null && (
        <PaymentReceiptModal
          isOpen={isReceiptOpen}
          onClose={() => {
            setIsReceiptOpen(false);
            setSelectedPagoId(null);
          }}
          pagoId={selectedPagoId}
        />
      )}
    </>
  );
};
