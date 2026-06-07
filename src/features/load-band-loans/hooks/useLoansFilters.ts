import { useState, useMemo } from 'react';
import type { Loan } from '@/entities/loan/model';
import { type LoanFormatted, convertTimestampToDate } from '@/entities/loan/model/loan-utils';

export type { LoanFormatted };

export const useLoansFilters = (loans: Loan[]) => {
  const [searchTerm, setSearchTerm] = useState('');

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

  const filtered = useMemo(() => {
    if (formattedLoans.length === 0) return [];
    if (!searchTerm) return formattedLoans;
    const term = searchTerm.toLowerCase();
    return formattedLoans.filter(
      (loan) =>
        loan.nombreEstudiante.toLowerCase().includes(term) ||
        loan.nombreInstrumento.toLowerCase().includes(term),
    );
  }, [formattedLoans, searchTerm]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  return {
    formattedLoans,
    filtered,
    paginatedItems: filtered,
    searchTerm,
    handleSearch,
  };
};
