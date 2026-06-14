export interface EditItemFormFields {
  nombre: string;
  cantidad_total: string;
  observacion: string;
  cantidad_disponible: string;
  cantidad_prestado: string;
  cantidad_mantenimiento: string;
}

export interface EditItemFormErrors {
  nombre?: string;
  cantidad_total?: string;
  cantidad_disponible?: string;
  cantidad_mantenimiento?: string;
  general?: string;
}

const parseInteger = (value: string): number | null => {
  if (value === '') return null;
  const n = Number(value);
  return Number.isInteger(n) ? n : NaN;
};

export const validateEditItemForm = (fields: EditItemFormFields): EditItemFormErrors => {
  const errors: EditItemFormErrors = {};

  if (!fields.nombre.trim()) {
    errors.nombre = 'El nombre es obligatorio';
  }

  const total = parseInteger(fields.cantidad_total);
  if (total !== null && (Number.isNaN(total) || total < 1)) {
    errors.cantidad_total = 'Debe ser un número entero mayor o igual a 1';
  }

  // Solo "disponible" y "mantenimiento" son editables; "prestado" se calcula a
  // partir de los préstamos activos y es de solo lectura.
  const editableStockFields = [
    { key: 'cantidad_disponible' },
    { key: 'cantidad_mantenimiento' },
  ] as const;

  const values: Record<
    'cantidad_disponible' | 'cantidad_prestado' | 'cantidad_mantenimiento',
    number | null
  > = {
    cantidad_disponible: parseInteger(fields.cantidad_disponible),
    cantidad_prestado: parseInteger(fields.cantidad_prestado),
    cantidad_mantenimiento: parseInteger(fields.cantidad_mantenimiento),
  };

  for (const { key } of editableStockFields) {
    const n = values[key];
    if (n !== null && (Number.isNaN(n) || n < 0)) {
      errors[key] = 'Debe ser un número entero mayor o igual a 0';
    }
  }

  // Si las cantidades de stock están presentes y son válidas, su suma (incluido
  // el prestado de solo lectura) debe coincidir con la cantidad total.
  const stockKeys = ['cantidad_disponible', 'cantidad_prestado', 'cantidad_mantenimiento'] as const;
  const allStockFilled = stockKeys.every((key) => fields[key] !== '');
  const noStockErrors = editableStockFields.every(({ key }) => !errors[key]);
  if (allStockFilled && noStockErrors && !errors.cantidad_total) {
    const disponible = values.cantidad_disponible ?? 0;
    const prestado = values.cantidad_prestado ?? 0;
    const mantenimiento = values.cantidad_mantenimiento ?? 0;
    const sum = disponible + prestado + mantenimiento;
    const referenceTotal = total ?? sum;
    if (sum !== referenceTotal) {
      errors.general = `La suma de disponible, prestado y mantenimiento (${String(sum)}) debe ser igual a la cantidad total (${String(referenceTotal)})`;
    }
  }

  return errors;
};
