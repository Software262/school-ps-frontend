import { useState, useMemo } from 'react';
import type { Inventory } from '@/entities/inventory/model/types';

export const useInventoryFilters = (inventory: Inventory[]) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = useMemo(() => {
    if (inventory.length === 0) return [];
    return inventory.filter(
      (instrument) =>
        instrument.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        instrument.observacion.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [inventory, searchTerm]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  return {
    filtered,
    paginatedItems: filtered,
    searchTerm,
    handleSearch,
  };
};
