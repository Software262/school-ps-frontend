import { useEffect, useState, useCallback } from 'react';
import type { Inventory } from '@/entities/inventory/model/types';
import { loadBand } from '@/features/load-band-inventory/api/load-band';
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue';

const ITEMS_PER_PAGE = 10;

export const useLoadInventory = () => {
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [refetchKey, setRefetchKey] = useState(0);

  const debouncedSearch = useDebouncedValue(searchTerm);

  useEffect(() => {
    loadBand(page, ITEMS_PER_PAGE, debouncedSearch)
      .then((result) => {
        setInventory(result.items);
        setTotalPages(result.totalPages);
        setTotal(result.total);
        setError(null);
      })
      .catch((err: unknown) => {
        console.error('Error cargando inventario:', err);
        setError('Error al cargar el inventario de banda');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [page, debouncedSearch, refetchKey]);

  const refetch = useCallback(() => {
    setLoading(true);
    setRefetchKey((k) => k + 1);
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(Math.max(1, newPage));
  }, []);

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    setPage(1);
  }, []);

  return {
    inventory,
    loading,
    error,
    refetch,
    page,
    totalPages,
    total,
    searchTerm,
    handlePageChange,
    handleSearch,
  };
};
