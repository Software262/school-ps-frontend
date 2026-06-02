import { useState, useMemo } from 'react';
import type { Inventory } from '@/entities/inventory/model/types';

const ITEMS_PER_PAGE = 10;

export const useInventoryFilters = (inventory: Inventory[]) => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = useMemo(() => {
    if (inventory.length === 0) return [];
    return inventory.filter(
      (instrument) =>
        instrument.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        instrument.observacion.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [inventory, searchTerm]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const currentPage = Math.min(page, Math.max(1, totalPages));

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedItems = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setPage(1);
  };
  const handlePageChange = (newPage: number) => {
    setPage(Math.max(1, Math.min(newPage, totalPages)));
  };

  return {
    filtered,
    paginatedItems,
    currentPage,
    totalPages,
    searchTerm,
    handleSearch,
    handlePageChange,
  };
};
