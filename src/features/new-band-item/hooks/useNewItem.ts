import { useState } from 'react';
import {
  type ItemFormFields,
  type ItemFormErrors,
  validateItemForm,
} from '@/entities/inventory/model/item-form';
import { createItem, getInventoryTypeByName } from '../api/create-item';

const INITIAL_FIELDS: ItemFormFields = {
  nombre: '',
  cantidad_total: '1',
  observacion: '',
};

export const useNewItem = (onSuccess: () => void) => {
  const [fields, setFields] = useState<ItemFormFields>(INITIAL_FIELDS);
  const [errors, setErrors] = useState<ItemFormErrors>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof ItemFormFields, value: string) => {
    setFields((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined, general: undefined }));
  };

  const handleSubmit = async (): Promise<void> => {
    const validationErrors = validateItemForm(fields);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const { id: tipo_inventario_id } = await getInventoryTypeByName('banda');
      await createItem({
        tipo_inventario_id,
        nombre: fields.nombre.trim(),
        cantidad_total: Number(fields.cantidad_total),
        observacion: fields.observacion || undefined,
      });
      reset();
      onSuccess();
    } catch {
      setErrors({ general: 'No se pudo crear el instrumento. Intenta de nuevo.' });
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFields(INITIAL_FIELDS);
    setErrors({});
  };

  return { fields, errors, loading, handleChange, handleSubmit, reset };
};
