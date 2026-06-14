import { useEffect, useState, useCallback } from 'react';
import type { Loan } from '@/entities/loan/model';
import type { LoansFilterType } from '@/entities/loan/model/loan-utils';
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue';

const ITEMS_PER_PAGE = 10;

type LoadFn = (
  page: number,
  limit: number,
  active?: boolean,
  search?: string,
) => Promise<{ items: Loan[]; totalPages: number; total: number }>;

const filterToActive = (filter: LoansFilterType): boolean | undefined => {
  if (filter === 'active') return true;
  if (filter === 'inactive') return false;
  return undefined;
};

export const useLoadLoansData = (loadFn: LoadFn) => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState<LoansFilterType>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [refetchKey, setRefetchKey] = useState(0);

  const debouncedSearch = useDebouncedValue(searchTerm);

  useEffect(() => {
    const active = filterToActive(filter);
    loadFn(page, ITEMS_PER_PAGE, active, debouncedSearch)
      .then((result) => {
        setLoans(result.items);
        setTotalPages(result.totalPages);
        setTotal(result.total);
        setError(null);
      })
      .catch((err: unknown) => {
        console.error('Error cargando préstamos:', err);
        setError('Error al cargar los préstamos');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [page, filter, debouncedSearch, refetchKey, loadFn]);

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

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
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
    searchTerm,
    handlePageChange,
    handleFilterChange,
    handleSearch,
  };
};
