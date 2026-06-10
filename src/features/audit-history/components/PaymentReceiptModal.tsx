import { useEffect, useState } from 'react';
import { Printer, Loader, AlertCircle } from 'lucide-react';
import { Modal } from '@/shared/ui/atoms/Modal';
import { Button } from '@/shared/ui/atoms/Button';
import { getPaymentReceipt } from '../api/auditApi';
import type { PaymentReceiptResponse } from '../types';

interface PaymentReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  pagoId: number;
}

export const PaymentReceiptModal = ({ isOpen, onClose, pagoId }: PaymentReceiptModalProps) => {
  const [receipt, setReceipt] = useState<PaymentReceiptResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !pagoId) return;

    const fetchReceipt = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getPaymentReceipt(pagoId);
        setReceipt(data);
      } catch (err: unknown) {
        console.error(err);
        setError('No se pudo cargar la información del comprobante de pago.');
      } finally {
        setLoading(false);
      }
    };

    void fetchReceipt();
  }, [isOpen, pagoId]);

  const handlePrint = () => {
    window.print();
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleString('es-CO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Comprobante de Pago" width={500}>
      {/* Print styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #print-receipt-area, #print-receipt-area * {
            visibility: visible;
          }
          #print-receipt-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
            background: white !important;
            color: black !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {loading ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 0',
            gap: '12px',
          }}
        >
          <Loader className="animate-spin" size={32} color="var(--brand-primary)" />
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Cargando comprobante...
          </p>
        </div>
      ) : error ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
            padding: '24px 0',
            color: 'var(--status-red)',
          }}
        >
          <AlertCircle size={32} />
          <p style={{ fontWeight: 500 }}>{error}</p>
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      ) : receipt ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Box Receipt Design Area */}
          <div
            id="print-receipt-area"
            style={{
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '24px',
              backgroundColor: '#fff',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
              fontFamily: 'Courier New, Courier, monospace',
              color: '#1e293b',
            }}
          >
            {/* Receipt Header */}
            <div
              style={{
                textAlign: 'center',
                borderBottom: '1.5px dashed #cbd5e1',
                paddingBottom: '16px',
                marginBottom: '16px',
              }}
            >
              <h3
                style={{
                  margin: '0 0 4px 0',
                  fontSize: '1.25rem',
                  fontWeight: 'bold',
                  letterSpacing: '1px',
                }}
              >
                Institucion Cambridge school
              </h3>
              <p style={{ margin: '0 0 4px 0', fontSize: '0.875rem' }}>NIT: 900.123.456-7</p>
              <p style={{ margin: '0 0 8px 0', fontSize: '0.875rem' }}>
                Módulo de Rectoria y Matrículas
              </p>
              <div
                style={{
                  display: 'inline-block',
                  border: '1px solid #1e293b',
                  padding: '4px 12px',
                  fontWeight: 'bold',
                  fontSize: '0.875rem',
                }}
              >
                RECIBO DE CAJA N° {receipt.codigo_talonario}
              </div>
            </div>

            {/* Receipt Metadata */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                fontSize: '0.875rem',
                borderBottom: '1px solid #e2e8f0',
                paddingBottom: '12px',
                marginBottom: '12px',
              }}
            >
              <div>
                <span style={{ fontWeight: 'bold' }}>FECHA PAGO :</span>{' '}
                {formatDate(receipt.fecha_pago)}
              </div>
              <div>
                <span style={{ fontWeight: 'bold' }}>ID TRANSAC:</span> {receipt.pago_id}
              </div>
              <div>
                <span style={{ fontWeight: 'bold' }}>ESTUDIANTE:</span>{' '}
                {receipt.estudiante.nombre.toUpperCase()}
              </div>
              <div>
                <span style={{ fontWeight: 'bold' }}>DOCUMENTO :</span>{' '}
                {receipt.estudiante.documento}
              </div>
              <div>
                <span style={{ fontWeight: 'bold' }}>GRADO :</span>{' '}
                {receipt.estudiante.grado.toUpperCase()}
              </div>
              <div>
                <span style={{ fontWeight: 'bold' }}>ACUDIENTE :</span>{' '}
                {receipt.acudiente.nombre.toUpperCase()}
              </div>
            </div>

            {/* Concept breakdown */}
            <div style={{ marginBottom: '16px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontWeight: 'bold',
                  borderBottom: '1px solid #1e293b',
                  paddingBottom: '4px',
                  fontSize: '0.875rem',
                  marginBottom: '8px',
                }}
              >
                <span>CONCEPTO DE PAGO</span>
                <span>VALOR APLICADO</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  fontSize: '0.875rem',
                }}
              >
                {receipt.distribuciones.map(
                  (dist: { concepto: string; monto_aplicado: number }, idx: number) => (
                    <div
                      key={`receipt-dist-${dist.concepto}-${idx.toString()}`}
                      style={{ display: 'flex', justifyContent: 'space-between' }}
                    >
                      <span>
                        {dist.concepto === 'matricula_base'
                          ? 'MATRÍCULA BASE'
                          : dist.concepto.toUpperCase()}
                      </span>
                      <span>${dist.monto_aplicado.toLocaleString()}</span>
                    </div>
                  ),
                )}
              </div>
            </div>

            {/* Total */}
            <div
              style={{
                borderTop: '1.5px dashed #cbd5e1',
                paddingTop: '12px',
                marginTop: '12px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '1.1rem',
                fontWeight: 'bold',
              }}
            >
              <span>TOTAL RECIBIDO:</span>
              <span>${receipt.monto_total.toLocaleString()}</span>
            </div>

            {/* Observations */}
            {receipt.observacion && (
              <div
                style={{
                  borderTop: '1px solid #e2e8f0',
                  paddingTop: '12px',
                  marginTop: '12px',
                  fontSize: '0.75rem',
                  color: '#64748b',
                  fontStyle: 'italic',
                }}
              >
                <span style={{ fontWeight: 'bold', fontStyle: 'normal' }}>Observación: </span>
                {receipt.observacion}
              </div>
            )}

            {/* Signatures */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '30px',
                marginTop: '48px',
                textAlign: 'center',
                fontSize: '0.75rem',
              }}
            >
              <div>
                <div style={{ borderBottom: '1px solid #cbd5e1', height: '24px' }}></div>
                <p style={{ marginTop: '6px', fontWeight: 'bold' }}>Entregué (Firma y C.C)</p>
              </div>
              <div>
                <div style={{ borderBottom: '1px solid #cbd5e1', height: '24px' }}></div>
                <p style={{ marginTop: '6px', fontWeight: 'bold' }}>Recibí (Firma Sello)</p>
              </div>
            </div>
          </div>

          {/* Modal Actions */}
          <div
            className="no-print"
            style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}
          >
            <Button variant="outline" onClick={onClose}>
              Cerrar
            </Button>
            <Button
              variant="primary"
              onClick={handlePrint}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Printer size={16} />
              Imprimir Comprobante
            </Button>{' '}
          </div>
        </div>
      ) : null}
    </Modal>
  );
};
