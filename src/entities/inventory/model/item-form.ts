export interface ItemFormFields {
  nombre: string;
  cantidad_total: string;
  observacion: string;
}

export interface ItemFormErrors {
  nombre?: string;
  cantidad_total?: string;
  general?: string;
}

export const validateItemForm = (fields: ItemFormFields): ItemFormErrors => {
  const errors: ItemFormErrors = {};

  if (!fields.nombre.trim()) {
    errors.nombre = 'El nombre es obligatorio';
  }

  const cantidad = Number(fields.cantidad_total);
  if (fields.cantidad_total === '' || !Number.isInteger(cantidad) || cantidad < 1) {
    errors.cantidad_total = 'La cantidad debe ser un número entero mayor o igual a 1';
  }

  return errors;
};
