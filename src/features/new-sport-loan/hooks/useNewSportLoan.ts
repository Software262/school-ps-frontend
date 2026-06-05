import { useState } from 'react';
import type { Inventory } from '@/entities/inventory/model/types';
import { createSportLoan } from '../api/create-sport-loan';
import type { SportLoanFormFields, SportLoanFormErrors } from '../types';

const toApiDatetime = (datetimeLocal: string): string => {
  const withSeconds = datetimeLocal.length === 16 ? `${datetimeLocal}:00` : datetimeLocal;
  return `${withSeconds}.000000`;
};

const nowLocal = (): string => {
  const d = new Date();
  d.setSeconds(0, 0);
  return d.toISOString().slice(0, 16);
};

const INITIAL_FIELDS = (): SportLoanFormFields => ({
  inventario_id: '',
  estudiante_id: '',
  fecha_salida: nowLocal(),
  cantidad: '1',
  observacion: '',
});

export const useNewSportLoan = (inventory: Inventory[], onSuccess: () => void) => {
  const [fields, setFields] = useState<SportLoanFormFields>(INITIAL_FIELDS);
  const [errors, setErrors] = useState<SportLoanFormErrors>({});
  const [loading, setLoading] = useState(false);

  const availableInventory = inventory.filter((i) => i.estado_objeto === 'disponible');
  const selectedItem = availableInventory.find((i) => i.id === Number(fields.inventario_id));

  const handleChange = (field: keyof SportLoanFormFields, value: string) => {
    setFields((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined, general: undefined }));
  };

  const validate = (): boolean => {
    const next: SportLoanFormErrors = {};

    if (!fields.inventario_id) {
      next.inventario_id = 'Selecciona un equipo deportivo';
    }

    const estudianteNum = Number(fields.estudiante_id);
    if (!fields.estudiante_id || !Number.isInteger(estudianteNum) || estudianteNum <= 0) {
      next.estudiante_id = 'Ingresa un ID de estudiante válido (número entero positivo)';
    }

    if (!fields.fecha_salida) {
      next.fecha_salida = 'Selecciona la fecha y hora de salida';
    }

    const cantidadNum = Number(fields.cantidad);
    if (!fields.cantidad || !Number.isInteger(cantidadNum) || cantidadNum <= 0) {
      next.cantidad = 'La cantidad debe ser un entero mayor a 0';
    } else if (selectedItem && cantidadNum > selectedItem.cantidad) {
      next.cantidad = `Máximo disponible: ${String(selectedItem.cantidad)}`;
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (): Promise<void> => {
    if (!validate()) return;

    setLoading(true);
    try {
      await createSportLoan({
        inventario_id: Number(fields.inventario_id),
        estudiante_id: Number(fields.estudiante_id),
        fecha_salida: toApiDatetime(fields.fecha_salida),
        cantidad: Number(fields.cantidad),
        observacion: fields.observacion,
      });
      reset();
      onSuccess();
    } catch {
      setErrors({
        general: 'No se pudo crear el préstamo. Verifica los datos e intenta de nuevo.',
      });
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFields(INITIAL_FIELDS());
    setErrors({});
  };

  return {
    fields,
    errors,
    loading,
    availableInventory,
    selectedItem,
    handleChange,
    handleSubmit,
    reset,
  };
};
