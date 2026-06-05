import { useState, type SubmitEvent } from 'react';
import { AlertTriangle } from 'lucide-react';
import { enrollmentApi } from '@/entities/student/api/enrollment';
import type { StudentBalance } from '@/entities/student/api/enrollment';
import { Button } from '@/shared/ui/atoms/Button';
import { Input } from '@/shared/ui/atoms/Input';
import { Modal } from '@/shared/ui/molecules/Modal';

interface ModifyEnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  balance: StudentBalance;
  concept: { id: string; name: string; currentVal: number; detalleId?: number } | null;
  onEditSuccess: () => Promise<void>;
}

export const ModifyEnrollmentModal = ({
  isOpen,
  onClose,
  balance,
  concept,
  onEditSuccess,
}: ModifyEnrollmentModalProps) => {
  const [newVal, setNewVal] = useState('');
  const [editReason, setEditReason] = useState('');
  const [editObs, setEditObs] = useState('');

  const handleEditSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    if (!concept || !newVal) return;

    const matriculaId = balance.matricula_id ?? balance.estudiante.id;

    try {
      const parsedValue = parseInt(newVal, 10);
      if (isNaN(parsedValue) || parsedValue < 0) {
        alert('El valor debe ser un número entero mayor o igual a 0.');
        return;
      }

      const payload: {
        motivo: string;
        observaciones?: string;
        nuevo_costo_base?: number;
        complementarios?: {
          detalle_id: number;
          nuevo_valor_completo?: number;
        }[];
      } = {
        motivo: editReason,
        observaciones: editObs ? editObs : undefined,
      };

      if (concept.id === 'matricula_base') {
        payload.nuevo_costo_base = parsedValue;
      } else if (concept.detalleId !== undefined) {
        payload.complementarios = [
          {
            detalle_id: concept.detalleId,
            nuevo_valor_completo: parsedValue,
          },
        ];
      } else {
        alert('Concepto inválido para edición');
        return;
      }

      await enrollmentApi.modifyEnrollment(matriculaId, payload);

      onClose();
      await onEditSuccess();
      alert('Edición registrada exitosamente');
    } catch (error: unknown) {
      console.error('Error modifying enrollment:', error);
      const errMsg =
        error instanceof Error
          ? error.message
          : 'Error al modificar matrícula. Por favor revise el log.';
      alert(errMsg);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar Valor de Matrícula">
      <div
        style={{
          background: '#fefce8',
          border: '1px solid #fde047',
          borderRadius: '8px',
          padding: '12px',
          display: 'flex',
          gap: '12px',
          marginBottom: '20px',
        }}
      >
        <AlertTriangle size={24} color="#a16207" style={{ flexShrink: 0 }} />
        <p style={{ color: '#854d0e', margin: 0, fontSize: '0.875rem' }}>
          ¿Está seguro de que desea modificar el valor de matrícula? Esta acción quedará registrada
          en la auditoría.
        </p>
      </div>

      <form
        onSubmit={(e) => {
          void handleEditSubmit(e);
        }}
        style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
      >
        <Input label="Concepto" value={concept?.name ?? ''} disabled />
        <Input
          label="Valor Actual"
          value={concept ? `$${concept.currentVal.toLocaleString()}` : ''}
          disabled
        />
        <Input
          label="Nuevo Valor *"
          type="number"
          required
          value={newVal}
          onChange={(e) => {
            setNewVal(e.target.value);
          }}
        />

        <div className="input-container">
          <label className="input-label">Motivo de la Modificación *</label>
          <textarea
            className="input-field"
            style={{ minHeight: '80px', padding: '8px 12px' }}
            placeholder="Ingrese el motivo de la edición (obligatorio)"
            required
            value={editReason}
            onChange={(e) => {
              setEditReason(e.target.value);
            }}
          />
        </div>

        <div className="input-container">
          <label className="input-label">Observaciones (Opcional)</label>
          <textarea
            className="input-field"
            style={{ minHeight: '60px', padding: '8px 12px' }}
            placeholder="Observaciones adicionales"
            value={editObs}
            onChange={(e) => {
              setEditObs(e.target.value);
            }}
          />
        </div>

        <div
          style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}
        >
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" style={{ backgroundColor: '#991b1b' }}>
            Confirmar Edición
          </Button>
        </div>
      </form>
    </Modal>
  );
};
