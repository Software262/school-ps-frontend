import { useState, useMemo } from 'react';
import type { Loan } from '@/entities/loan/model';

const ITEMS_PER_PAGE = 10;

export type LoansFilterType = 'all' | 'active' | 'inactive';

export interface LoanFormatted {
  id: number;
  nombreEstudiante: string;
  nombreInstrumento: string;
  cantidad: number;
  fechaPrestamo: string;
  fechaDevolucion: string | null;
  enPrestamo: boolean;
  observacion: string;
}

const convertTimestampToDate = (timestamp: number | null | undefined): string | null => {
  if (!timestamp) return null;

  try {
    // Intentar con milisegundos primero
    let date = new Date(timestamp * 1000);

    // Si la fecha es inválida o está muy lejos, intentar con segundos
    if (isNaN(date.getTime()) || date.getFullYear() > 2100) {
      date = new Date(timestamp);
    }

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

export const useLoansFilters = (loans: Loan[]) => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<LoansFilterType>('all');

  const formattedLoans: LoanFormatted[] = useMemo(() => {
    return loans
      .map((loan) => {
        const fechaPrestamo = convertTimestampToDate(loan.fecha_salida);
        const fechaDevolucion = convertTimestampToDate(loan.fecha_devolucion);

        if (!fechaPrestamo) {
          return null;
        }

        return {
          id: loan.id,
          nombreEstudiante: `Estudiante ${String(loan.estudiante_id)}`,
          nombreInstrumento: `Instrumento ${String(loan.inventario_id)}`,
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
    filtered,
    currentPage,
    totalPages,
    searchTerm,
    filter,
    handleSearch,
    handleFilterChange,
    handlePageChange,
  };
};
