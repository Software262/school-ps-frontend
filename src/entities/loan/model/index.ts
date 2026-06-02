export type { LoansFilterType, LoanFormatted } from './loan-utils';
export { convertTimestampToDate } from './loan-utils';

export interface Loan {
  id: number;
  inventario_id: number;
  estudiante_id: number;
  fecha_salida: number;
  fecha_devolucion?: number | null;
  estado_prestamo: boolean;
  cantidad: number;
  observacion?: string | null;
}