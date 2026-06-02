import { useState } from 'react';
import {
  BandAlert,
  BandStats,
  BandTabs,
  InventorySection,
} from '@/features/load-band-inventory/components';
import { useLoadInventory, useInventoryFilters } from '@/features/load-band-inventory/hooks';
import { LoansSection } from '@/features/load-band-loans/components';
import { useLoadLoans, useLoansFilters } from '@/features/load-band-loans/hooks';
import './BandPage.css';

export const BandPage = () => {
  const { inventory } = useLoadInventory();
  const {
    filtered: filteredInventory,
    currentPage,
    totalPages,
    searchTerm,
    handleSearch,
    handlePageChange,
  } = useInventoryFilters(inventory);

  const { loans } = useLoadLoans();
  const {
    filtered: filteredLoans,
    currentPage: loansCurrentPage,
    totalPages: loansTotalPages,
    searchTerm: loansSearchTerm,
    filter: loansFilter,
    handleSearch: handleLoansSearch,
    handleFilterChange: handleLoansFilterChange,
    handlePageChange: handleLoansPageChange,
  } = useLoansFilters(loans);

  const [activeTab, setActiveTab] = useState<'inventory' | 'loans'>('inventory');

  const stats = [
    {
      label: 'Total Instrumentos',
      value: '12',
      variant: 'default' as const,
    },
    {
      label: 'Disponibles',
      value: '7',
      variant: 'green' as const,
    },
    {
      label: 'Prestados',
      value: '3',
      variant: 'yellow' as const,
    },
    {
      label: 'Mantenimiento',
      value: '2',
      variant: 'gray' as const,
    },
  ];

  return (
    <div className="band-page">
      <header className="band-header">
        <h1>Módulo de Banda</h1>
        <p>Gestión de instrumentos musicales</p>
      </header>

      <BandAlert />

      <BandStats stats={stats} />

      <BandTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="band-content">
        {activeTab === 'inventory' && (
          <InventorySection
            inventory={filteredInventory}
            searchTerm={searchTerm}
            currentPage={currentPage}
            totalPages={totalPages}
            onSearchChange={handleSearch}
            onPageChange={handlePageChange}
          />
        )}
        {activeTab === 'loans' && (
          <LoansSection
            loans={filteredLoans}
            searchTerm={loansSearchTerm}
            filter={loansFilter}
            currentPage={loansCurrentPage}
            totalPages={loansTotalPages}
            onSearchChange={handleLoansSearch}
            onFilterChange={handleLoansFilterChange}
            onPageChange={handleLoansPageChange}
          />
        )}
      </div>
    </div>
  );
};
