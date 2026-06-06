import { useState, useMemo } from 'react';
import type { Loan } from '@/entities/loan/model';
import {
  type LoansFilterType,
  type LoanFormatted,
  convertTimestampToDate,
} from '@/entities/loan/model/loan-utils';

export type { LoansFilterType, LoanFormatted };

const ITEMS_PER_PAGE = 10;

export const useSportLoansFilters = (loans: Loan[]) => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<LoansFilterType>('all');

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
    return formattedLoans.filter(
      (loan) =>
        (filter === 'all' ||
          (filter === 'active' && loan.enPrestamo) ||
          (filter === 'inactive' && !loan.enPrestamo)) &&
        (loan.nombreEstudiante.toLowerCase().includes(searchTerm.toLowerCase()) ||
          loan.nombreInstrumento.toLowerCase().includes(searchTerm.toLowerCase())),
    );
  }, [formattedLoans, searchTerm, filter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const currentPage = Math.min(page, Math.max(1, totalPages));

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedItems = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setPage(1);
  };
  const handleFilterChange = (newFilter: LoansFilterType) => {
    setFilter(newFilter);
    setPage(1);
  };
  const handlePageChange = (newPage: number) => {
    setPage(Math.max(1, Math.min(newPage, totalPages)));
  };

  return {
    formattedLoans,
    filtered,
    paginatedItems,
    currentPage,
    totalPages,
    searchTerm,
    filter,
    handleSearch,
    handleFilterChange,
    handlePageChange,
  };
};
