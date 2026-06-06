import { useState } from 'react';
import type { Inventory } from '@/entities/inventory/model/types';
import {
  type ItemFormFields,
  type ItemFormErrors,
  validateItemForm,
} from '@/entities/inventory/model/item-form';
import { editSportItem } from '../api/edit-sport-item';

export const useEditSportItem = (item: Inventory | null, onSuccess: () => void) => {
  const [prevItem, setPrevItem] = useState<Inventory | null>(null);
  const [fields, setFields] = useState<ItemFormFields>({
    nombre: '',
    cantidad: '1',
    estado_objeto: 'disponible',
    observacion: '',
  });
  const [errors, setErrors] = useState<ItemFormErrors>({});
  const [loading, setLoading] = useState(false);

  if (item !== prevItem) {
    setPrevItem(item);
    if (item) {
      setFields({
        nombre: item.nombre,
        cantidad: String(item.cantidad),
        estado_objeto: item.estado_objeto,
        observacion: item.observacion,
      });
      setErrors({});
    }
  }

  const handleChange = (field: keyof ItemFormFields, value: string) => {
    setFields((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined, general: undefined }));
  };

  const handleSubmit = async (): Promise<void> => {
    if (!item) return;

    const validationErrors = validateItemForm(fields);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      await editSportItem(item.id, {
        nombre: fields.nombre.trim(),
        cantidad: Number(fields.cantidad),
        estado_objeto: fields.estado_objeto,
        observacion: fields.observacion,
      });
      onSuccess();
    } catch {
      setErrors({ general: 'No se pudo actualizar el equipo deportivo. Intenta de nuevo.' });
    } finally {
      setLoading(false);
    }
  };

  return { fields, errors, loading, handleChange, handleSubmit };
};
