import { useState } from 'react';
import { Modal } from '@/shared/ui/atoms/Modal';
import { Button } from '@/shared/ui/atoms/Button';
import { Input } from '@/shared/ui/atoms/Input';

interface CopyFeesModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentYear: number;
  onConfirm: (sourceYear: number, targetYear: number, incrementPct: number) => Promise<void>;
}

export const CopyFeesModal = ({ isOpen, onClose, currentYear, onConfirm }: CopyFeesModalProps) => {
  const [sourceYear, setSourceYear] = useState<number>(currentYear);
  const [targetYear, setTargetYear] = useState<number>(currentYear + 1);
  const [incrementPct, setIncrementPct] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (sourceYear === targetYear) {
      setError('El año de destino no puede ser igual al año de origen');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await onConfirm(sourceYear, targetYear, incrementPct);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al copiar las tarifas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Copiar Tarifas entre Años" width={500}>
      <form
        onSubmit={(e) => {
          void handleSubmit(e);
        }}
        style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
      >
        <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Copia la configuración de tarifas de matrícula y pensión de un año existente a un nuevo
          año lectivo, con la opción de aplicar un incremento porcentual (ej: IPC o ajuste
          institucional).
        </p>

        {error && (
          <div
            style={{
              padding: '10px 14px',
              backgroundColor: 'var(--status-red-bg)',
              color: 'var(--status-red)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.875rem',
            }}
          >
            {error}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Año Origen
            </label>
            <Input
              type="number"
              value={sourceYear}
              onChange={(e) => {
                setSourceYear(Number(e.target.value));
              }}
              min={2000}
              max={2100}
              required
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Año Destino
            </label>
            <Input
              type="number"
              value={targetYear}
              onChange={(e) => {
                setTargetYear(Number(e.target.value));
              }}
              min={2000}
              max={2100}
              required
            />
          </div>
        </div>

        <div>
          <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            Incremento Porcentual Opcional (%)
          </label>
          <Input
            type="number"
            step="0.1"
            value={incrementPct}
            onChange={(e) => {
              setIncrementPct(Number(e.target.value));
            }}
            min={0}
            max={100}
            placeholder="0 para mantener los mismos valores"
          />
          <span
            style={{
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              marginTop: '4px',
              display: 'block',
            }}
          >
            Los valores resultantes se redondearán al múltiplo de $1,000 más cercano.
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
          <Button variant="outline" type="button" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? 'Copiando...' : 'Copiar y Aplicar'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
