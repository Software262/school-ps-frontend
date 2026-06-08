import { useState, type SubmitEvent } from 'react';
import { DollarSign, Check } from 'lucide-react';
import { usePayEnrollment } from '../hooks/usePayEnrollment';
import type { StudentBalance } from '@/entities/student/model/types';
import { Button } from '@/shared/ui/atoms/Button';
import { Input } from '@/shared/ui/atoms/Input';
import type { Asign } from '../types';

interface PayEnrollmentFormProps {
  balance: StudentBalance;
  onPaymentSuccess: () => Promise<void>;
}

export const PayEnrollmentForm = ({ balance, onPaymentSuccess }: PayEnrollmentFormProps) => {
  const [receiptNumber, setReceiptNumber] = useState('');
  const [paymentAmounts, setPaymentAmounts] = useState<Record<string, string>>(() => {
    const initialAmounts: Record<string, string> = {};
    if (balance.pendiente_base > 0) {
      initialAmounts.matricula_base = balance.pendiente_base.toString();
    }
    balance.complementarios.forEach((c) => {
      if (c.valor_pendiente > 0) {
        initialAmounts[`comp_${c.detalle_id.toString()}`] = c.valor_pendiente.toString();
      }
    });
    return initialAmounts;
  });
  const { submitPayment, loading: paymentLoading } = usePayEnrollment();

  const handleAmountChange = (key: string, val: string) => {
    setPaymentAmounts((prev) => ({ ...prev, [key]: val }));
  };

  const handlePayment = async (e: SubmitEvent) => {
    e.preventDefault();
    if (!receiptNumber) return;

    try {
      const asignaciones: Asign[] = [];
      for (const key in paymentAmounts) {
        const monto = Number(paymentAmounts[key]);
        if (monto > 0) {
          if (key === 'matricula_base') {
            asignaciones.push({ concepto: 'matricula_base', monto });
          } else if (key.startsWith('comp_')) {
            const detalleId = Number(key.split('_')[1]);
            const comp = balance.complementarios.find((c) => c.detalle_id === detalleId);
            if (comp) {
              asignaciones.push({
                concepto: 'complementario',
                complementario_id: comp.complementario_id,
                detalle_id: comp.detalle_id,
                monto,
              });
            }
          }
        }
      }

      if (asignaciones.length === 0) {
        alert('Debe ingresar al menos un monto para pagar.');
        return;
      }

      const matriculaId = balance.matricula_id ?? balance.estudiante.id;

      await submitPayment({
        matricula_id: matriculaId,
        asignaciones,
        codigo_talonario: receiptNumber,
        observacion: 'Pago registrado desde portal administrativo',
      });

      setReceiptNumber('');
      await onPaymentSuccess();
      alert('Pago registrado exitosamente');
    } catch (error) {
      console.error('Error registering payment:', error);
      alert('Error al registrar pago. Por favor revise el log.');
    }
  };

  if (balance.total_pendiente <= 0) return null;

  // Items with pending debt
  const debtItems: { id: string; label: string; max: number }[] = [];
  if (balance.pendiente_base > 0) {
    debtItems.push({ id: 'matricula_base', label: 'Matrícula Base', max: balance.pendiente_base });
  }
  balance.complementarios.forEach((c) => {
    if (c.valor_pendiente > 0) {
      debtItems.push({
        id: `comp_${c.detalle_id.toString()}`,
        label: c.tipo_complementario,
        max: c.valor_pendiente,
      });
    }
  });

  return (
    <div className="card">
      <h3
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '1.1rem',
          marginBottom: '20px',
        }}
      >
        <DollarSign size={20} /> Registrar Pago
      </h3>

      <form
        onSubmit={(e) => {
          void handlePayment(e);
        }}
        style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
      >
        <div style={{ maxWidth: '300px' }}>
          <Input
            label="Número de Tirilla *"
            placeholder="Ingrese número de tirilla"
            required
            value={receiptNumber}
            onChange={(e) => {
              setReceiptNumber(e.target.value);
            }}
          />
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginTop: '8px',
          }}
        >
          {debtItems.map((item) => (
            <Input
              key={item.id}
              label={`Monto a Pagar (${item.label})`}
              type="number"
              placeholder="0"
              min={0}
              max={item.max}
              value={paymentAmounts[item.id] ?? ''}
              onChange={(e) => {
                handleAmountChange(item.id, e.target.value);
              }}
            />
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '16px' }}>
          <Button
            type="submit"
            variant="primary"
            style={{ backgroundColor: '#16a34a' }}
            disabled={paymentLoading}
          >
            <Check size={16} style={{ marginRight: '8px' }} />
            Registrar Pago
          </Button>
        </div>
      </form>
    </div>
  );
};
