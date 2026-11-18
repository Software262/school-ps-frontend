import { useState } from 'react';
import { Modal } from '@/shared/ui/atoms/Modal';
import { Button } from '@/shared/ui/atoms/Button';
import { Input } from '@/shared/ui/atoms/Input';

interface MassiveAdjustmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  year: number;
  onApply: (percentage: number) => void;
}

export const MassiveAdjustmentModal = ({
  isOpen,
  onClose,
  year,
  onApply,
}: MassiveAdjustmentModalProps) => {
  const [percentage, setPercentage] = useState<number>(5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApply(percentage);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Ajuste Porcentual Masivo" width={460}>
      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
      >
        <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Aplica un incremento o decremento porcentual a todas las tarifas de matrícula y pensión
          mostradas para el año {year}.
        </p>

        <div>
          <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            Porcentaje de Ajuste (%)
          </label>
          <Input
            type="number"
            step="0.1"
            value={percentage}
            onChange={(e) => {
              setPercentage(Number(e.target.value));
            }}
            placeholder="Ej: 5 para +5%, -3 para reducción"
            required
          />
          <span
            style={{
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              marginTop: '4px',
              display: 'block',
            }}
          >
            Los valores en la tabla se actualizarán temporalmente para que los revises antes de
            guardar.
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
          <Button variant="outline" type="button" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit">
            Aplicar Ajuste a la Tabla
          </Button>
        </div>
      </form>
    </Modal>
  );
};
