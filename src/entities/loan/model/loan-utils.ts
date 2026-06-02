export type LoansFilterType = 'all' | 'active' | 'inactive';

export interface LoanFormatted {
  id: number;
  inventario_id: number;
  estudiante_id: number;
  nombreEstudiante: string;
  nombreInstrumento: string;
  cantidad: number;
  fechaPrestamo: string;
  fechaDevolucion: string | null;
  enPrestamo: boolean;
  observacion: string;
}

export const convertTimestampToDate = (timestamp: number | null | undefined): string | null => {
  if (!timestamp) return null;

  try {
    let date = new Date(timestamp * 1000);
    if (isNaN(date.getTime()) || date.getFullYear() > 2100) date = new Date(timestamp);

    if (isNaN(date.getTime())) {
      console.warn(`Timestamp inválido: ${String(timestamp)}`);
      return null;
    }

    return date.toISOString().split('T')[0];
  } catch (error) {
    console.error(`Error convirtiendo timestamp ${String(timestamp)}:`, error);
    return null;
  }
};