import { useState } from 'react';
import {
  type ItemFormFields,
  type ItemFormErrors,
  validateItemForm,
} from '@/entities/inventory/model/item-form';
import { createSportItem, getInventoryTypeByName } from '../api/create-sport-item';

const INITIAL_FIELDS: ItemFormFields = {
  nombre: '',
  cantidad: '1',
  estado_objeto: 'disponible',
  observacion: '',
};

export const useNewSportItem = (onSuccess: () => void) => {
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
      const { id: tipo_inventario_id } = await getInventoryTypeByName('deporte');
      await createSportItem({
        tipo_inventario_id,
        nombre: fields.nombre.trim(),
        cantidad: Number(fields.cantidad),
        estado_objeto: fields.estado_objeto,
        observacion: fields.observacion,
      });
      reset();
      onSuccess();
    } catch {
      setErrors({ general: 'No se pudo crear el equipo deportivo. Intenta de nuevo.' });
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
