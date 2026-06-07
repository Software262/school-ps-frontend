export interface ItemFormFields {
  nombre: string;
  cantidad: string;
  estado_objeto: string;
  observacion: string;
}

export interface ItemFormErrors {
  nombre?: string;
  cantidad?: string;
  estado_objeto?: string;
  general?: string;
}

export const ESTADO_OBJETO_OPTIONS = [
  { value: 'disponible', label: 'Disponible' },
  { value: 'prestado', label: 'Prestado' },
  { value: 'mantenimiento', label: 'Mantenimiento' },
] as const;

export const validateItemForm = (fields: ItemFormFields): ItemFormErrors => {
  const errors: ItemFormErrors = {};

  if (!fields.nombre.trim()) {
    errors.nombre = 'El nombre es obligatorio';
  }

  const cantidad = Number(fields.cantidad);
  if (fields.cantidad === '' || !Number.isInteger(cantidad) || cantidad < 0) {
    errors.cantidad = 'La cantidad debe ser un número entero mayor o igual a 0';
  }

  if (!fields.estado_objeto) {
    errors.estado_objeto = 'Selecciona un estado';
  }

  return errors;
};
