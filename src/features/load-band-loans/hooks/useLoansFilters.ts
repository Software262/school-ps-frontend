import { useMemo } from 'react';
import type { Loan } from '@/entities/loan/model';
import { type LoanFormatted, convertTimestampToDate } from '@/entities/loan/model/loan-utils';

export type { LoanFormatted };

/**
 * Da formato a los préstamos que llegan del servidor. La búsqueda (`q`), el
 * filtro (activo/inactivo) y la paginación se resuelven en el backend, por lo
 * que aquí sólo transformamos la página actual al formato que usa la tabla.
 */
export const useLoansFilters = (loans: Loan[]) => {
  const formattedLoans: LoanFormatted[] = useMemo(() => {
    return loans
      .map((loan) => {
        const fechaPrestamo = convertTimestampToDate(loan.fecha_salida);
        const fechaDevolucion = convertTimestampToDate(loan.fecha_devolucion);
        if (!fechaPrestamo) return null;
        return {
          id: loan.id,
          inventario_id: loan.inventario_id,
          estudiante_id: loan.estudiante_id,
          nombreEstudiante: loan.nombre_estudiante,
          nombreInstrumento: loan.nombre_articulo,
          cantidad: loan.cantidad,
          fechaPrestamo,
          fechaDevolucion,
          enPrestamo: loan.estado_prestamo,
          observacion: loan.observacion ?? '',
        };
      })
      .filter((loan): loan is LoanFormatted => loan !== null);
  }, [loans]);

  return { formattedLoans };
};
