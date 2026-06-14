import { useState } from 'react';
import { getStockCantidad, type Inventory } from '@/entities/inventory/model/types';
import {
  type EditItemFormFields,
  type EditItemFormErrors,
  validateEditItemForm,
} from '@/entities/inventory/model/edit-item-form';
import { editSportItem } from '../api/edit-sport-item';

export const useEditSportItem = (item: Inventory | null, onSuccess: () => void) => {
  const [prevItem, setPrevItem] = useState<Inventory | null>(null);
  const [fields, setFields] = useState<EditItemFormFields>({
    nombre: '',
    cantidad_total: '',
    observacion: '',
    cantidad_disponible: '',
    cantidad_prestado: '',
    cantidad_mantenimiento: '',
  });
  const [errors, setErrors] = useState<EditItemFormErrors>({});
  const [loading, setLoading] = useState(false);

  if (item !== prevItem) {
    setPrevItem(item);
    if (item) {
      setFields({
        nombre: item.nombre,
        cantidad_total: String(item.cantidad_total),
        observacion: item.observacion ?? '',
        cantidad_disponible: String(getStockCantidad(item.stocks, 'disponible')),
        cantidad_prestado: String(getStockCantidad(item.stocks, 'prestado')),
        cantidad_mantenimiento: String(getStockCantidad(item.stocks, 'mantenimiento')),
      });
      setErrors({});
    }
  }

  const handleChange = (field: keyof EditItemFormFields, value: string) => {
    setFields((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined, general: undefined }));
  };

  const handleSubmit = async (): Promise<void> => {
    if (!item) return;

    const validationErrors = validateEditItemForm(fields);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      await editSportItem(item.id, {
        tipo_inventario_id: item.tipo_inventario_id,
        nombre: fields.nombre.trim() || undefined,
        cantidad_total: fields.cantidad_total !== '' ? Number(fields.cantidad_total) : undefined,
        observacion: fields.observacion || undefined,
        cantidad_disponible:
          fields.cantidad_disponible !== '' ? Number(fields.cantidad_disponible) : undefined,
        cantidad_mantenimiento:
          fields.cantidad_mantenimiento !== '' ? Number(fields.cantidad_mantenimiento) : undefined,
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
