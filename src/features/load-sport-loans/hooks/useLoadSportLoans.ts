import { useEffect, useState, useCallback } from 'react';
import type { Loan } from '@/entities/loan/model';
import type { LoansFilterType } from '@/entities/loan/model/loan-utils';
import { loadSportLoans } from '../api/load-sport-loans';

const ITEMS_PER_PAGE = 10;

const filterToActive = (filter: LoansFilterType): boolean | undefined => {
  if (filter === 'active') return true;
  if (filter === 'inactive') return false;
  return undefined;
};

export const useLoadSportLoans = () => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState<LoansFilterType>('all');
  const [refetchKey, setRefetchKey] = useState(0);

  useEffect(() => {
    const active = filterToActive(filter);
    loadSportLoans(page, ITEMS_PER_PAGE, active)
      .then((result) => {
        setLoans(result.items);
        setTotalPages(result.totalPages);
        setTotal(result.total);
        setError(null);
      })
      .catch((err: unknown) => {
        console.error('Error cargando préstamos de deportes:', err);
        setError('Error al cargar los préstamos de deportes');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [page, filter, refetchKey]);

  const refetch = useCallback(() => {
    setLoading(true);
    setRefetchKey((k) => k + 1);
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setLoading(true);
    setPage(Math.max(1, newPage));
  }, []);

  const handleFilterChange = useCallback((newFilter: LoansFilterType) => {
    setLoading(true);
    setFilter(newFilter);
    setPage(1);
  }, []);

  return {
    loans,
    loading,
    error,
    refetch,
    page,
    totalPages,
    total,
    filter,
    handlePageChange,
    handleFilterChange,
  };
};
