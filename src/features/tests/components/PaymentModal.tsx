import { useState } from 'react';
import { Modal } from '@/shared/ui/atoms/Modal';
import { Button } from '@/shared/ui/atoms/Button';
import { Input } from '@/shared/ui/atoms/Input';
import { Spinner } from '@/shared/ui/atoms/Spinner';
import type { PruebaAssignment } from '@/entities/tests/model/types';

interface PaymentModalProps {
  item: PruebaAssignment;
  onClose: () => void;
  onConfirm: (monto: number) => Promise<void>;
}

export function PaymentModal({ item, onClose, onConfirm }: PaymentModalProps) {
  const saldoPendiente = (item.valor ?? 0) - item.valor_pagado;
  const [monto, setMonto] = useState<string>(saldoPendiente.toString());
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    const val = parseInt(monto);
    if (isNaN(val) || val <= 0) {
      alert('Ingresa un monto válido');
      return;
    }
    if (val > saldoPendiente) {
      alert('El monto no puede ser mayor al saldo pendiente');
      return;
    }

    setLoading(true);
    try {
      await onConfirm(val);
      onClose();
    } catch (e) {
      console.error(e);
      alert('Error al procesar el pago');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen title="Registrar Abono" onClose={onClose} width={440}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div
          style={{
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--status-red-bg)',
            border: '1px solid var(--status-red-border)',
            fontSize: 'var(--font-size-sm)',
            color: 'var(--brand-primary)',
            lineHeight: 1.6,
          }}
        >
          Estudiante: <strong>{item.estudianteNombre}</strong>
          <br />
          Prueba: <strong>{item.pruebaNombre}</strong>
          <br />
          Saldo Pendiente: <strong>${saldoPendiente.toLocaleString()}</strong>
        </div>

        <Input
          label="Monto a abonar ($)"
          type="number"
          value={monto}
          onChange={(e) => {
            setMonto(e.target.value);
          }}
          placeholder="Ej. 20000"
          autoFocus
        />

        <div className="form-actions">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              void handlePay();
            }}
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner size={14} color="white" /> Procesando...
              </>
            ) : (
              'Confirmar Pago'
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
