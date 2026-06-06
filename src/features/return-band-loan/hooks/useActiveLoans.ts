import { useEffect, useState, useCallback } from 'react';
import type { Loan } from '@/entities/loan/model';
import { type LoanFormatted, convertTimestampToDate } from '@/entities/loan/model/loan-utils';
import { loadLoans } from '@/features/load-band-loans/api/load-loans';

const ACTIVE_LOANS_LIMIT = 500;
const MODAL_PAGE_SIZE = 10;

export const useActiveLoans = () => {
  const [allActive, setAllActive] = useState<LoanFormatted[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [refetchKey, setRefetchKey] = useState(0);

  useEffect(() => {
    loadLoans(1, ACTIVE_LOANS_LIMIT, true)
      .then((result) => {
        const formatted = result.items
          .map((loan: Loan) => {
            const fechaPrestamo = convertTimestampToDate(loan.fecha_salida);
            if (!fechaPrestamo) return null;
            return {
              id: loan.id,
              inventario_id: loan.inventario_id,
              estudiante_id: loan.estudiante_id,
              nombreEstudiante: loan.nombre_estudiante,
              nombreInstrumento: loan.nombre_articulo,
              cantidad: loan.cantidad,
              fechaPrestamo,
              fechaDevolucion: convertTimestampToDate(loan.fecha_devolucion),
              enPrestamo: loan.estado_prestamo,
              observacion: loan.observacion ?? '',
            };
          })
          .filter((loan): loan is LoanFormatted => loan !== null);
        setAllActive(formatted);
        setError(null);
      })
      .catch((err: unknown) => {
        console.error('Error cargando préstamos activos:', err);
        setError('Error al cargar los préstamos activos');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [refetchKey]);

  const totalPages = Math.max(1, Math.ceil(allActive.length / MODAL_PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * MODAL_PAGE_SIZE;
  const paginatedItems = allActive.slice(startIndex, startIndex + MODAL_PAGE_SIZE);

  const refetch = useCallback(() => {
    setLoading(true);
    setRefetchKey((k) => k + 1);
  }, []);

  const handlePageChange = useCallback(
    (newPage: number) => {
      setPage(Math.max(1, Math.min(newPage, totalPages)));
    },
    [totalPages],
  );

  const reset = useCallback(() => {
    setPage(1);
  }, []);

  return {
    allActive,
    paginatedItems,
    loading,
    error,
    page: currentPage,
    totalPages,
    total: allActive.length,
    refetch,
    handlePageChange,
    reset,
  };
};
