import { useState } from 'react';
import type { ChessItemFormFields, ChessItemFormErrors } from '../types';
import { createChessItem, getInventoryTypeByName } from '../api/create-chess-item';

const INITIAL_FIELDS: ChessItemFormFields = {
  nombre: '',
  cantidad_total: '1',
  piezas_totales: '32',
  observacion: '',
};

export const validateChessItemForm = (fields: ChessItemFormFields): ChessItemFormErrors => {
  const errors: ChessItemFormErrors = {};

  if (!fields.nombre.trim()) {
    errors.nombre = 'El nombre es obligatorio';
  } else if (fields.nombre.length < 2) {
    errors.nombre = 'El nombre debe tener al menos 2 caracteres';
  }

  const cantidad = Number(fields.cantidad_total);
  if (fields.cantidad_total === '' || !Number.isInteger(cantidad) || cantidad < 1) {
    errors.cantidad_total = 'La cantidad debe ser un número entero mayor o igual a 1';
  }

  const piezas = Number(fields.piezas_totales);
  if (fields.piezas_totales === '' || !Number.isInteger(piezas) || piezas < 1) {
    errors.piezas_totales = 'Las piezas deben ser un número entero mayor o igual a 1';
  }

  return errors;
};

export const useNewChessItem = (onSuccess: () => void) => {
  const [fields, setFields] = useState<ChessItemFormFields>(INITIAL_FIELDS);
  const [errors, setErrors] = useState<ChessItemFormErrors>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof ChessItemFormFields, value: string) => {
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
      const { id: tipo_inventario_id } = await getInventoryTypeByName('ajedrez');
      const piezas = Number(fields.piezas_totales);
      const serializedObservacion = `[PIEZAS:${piezas}] ${fields.observacion || ''}`.trim();
      await createChessItem({
        tipo_inventario_id,
        nombre: fields.nombre.trim(),
        cantidad_total: Number(fields.cantidad_total),
        observacion: serializedObservacion || undefined,
      });
      reset();
      onSuccess();
    } catch {
      setErrors({ general: 'No se pudo crear el artículo de ajedrez. Intenta de nuevo.' });
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
