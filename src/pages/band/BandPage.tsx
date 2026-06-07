import { useState } from 'react';
import { BandAlert, BandStats, BandTabs, useBandStats } from '@/features/band';
import { InventorySection } from '@/features/load-band-inventory/components';
import { useLoadInventory, useInventoryFilters } from '@/features/load-band-inventory/hooks';
import { LoansSection } from '@/features/load-band-loans/components';
import { useLoadLoans, useLoansFilters } from '@/features/load-band-loans/hooks';
import { NewLoanModal } from '@/features/new-band-loan';
import { ReturnLoanModal } from '@/features/return-band-loan';
import { useActiveLoans } from '@/features/return-band-loan/hooks';
import { NewItemModal } from '@/features/new-band-item';
import { EditItemModal } from '@/features/edit-band-item';
import type { Inventory } from '@/entities/inventory/model/types';
import './BandPage.css';

export const BandPage = () => {
  const {
    inventory,
    refetch: refetchInventory,
    page: inventoryPage,
    totalPages: inventoryTotalPages,
    handlePageChange: handleInventoryPageChange,
  } = useLoadInventory();

  const {
    paginatedItems: paginatedInventory,
    searchTerm,
    handleSearch,
  } = useInventoryFilters(inventory);

  const {
    loans,
    refetch: refetchLoans,
    page: loansPage,
    totalPages: loansTotalPages,
    filter: loansFilter,
    handlePageChange: handleLoansPageChange,
    handleFilterChange: handleLoansFilterChange,
  } = useLoadLoans();

  const {
    paginatedItems: paginatedLoans,
    searchTerm: loansSearchTerm,
    handleSearch: handleLoansSearch,
  } = useLoansFilters(loans);

  const {
    paginatedItems: activeLoansPaginated,
    page: activeLoansPage,
    totalPages: activeLoansTotalPages,
    total: activeLoansTotal,
    loading: activeLoansLoading,
    handlePageChange: handleActiveLoansPageChange,
    refetch: refetchActiveLoans,
    reset: resetActiveLoans,
  } = useActiveLoans();

  const [activeTab, setActiveTab] = useState<'inventory' | 'loans'>('inventory');
  const [selectedInventoryItem, setSelectedInventoryItem] = useState<Inventory | null>(null);
  const [isNewItemOpen, setIsNewItemOpen] = useState(false);
  const [isEditItemOpen, setIsEditItemOpen] = useState(false);
  const [isNewLoanOpen, setIsNewLoanOpen] = useState(false);
  const [isReturnLoanOpen, setIsReturnLoanOpen] = useState(false);
  const stats = useBandStats(inventory);

  const handleOpenReturnLoan = () => {
    resetActiveLoans();
    setIsReturnLoanOpen(true);
  };

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
            inventory={paginatedInventory}
            searchTerm={searchTerm}
            currentPage={inventoryPage}
            totalPages={inventoryTotalPages}
            selectedItem={selectedInventoryItem}
            onSearchChange={handleSearch}
            onPageChange={handleInventoryPageChange}
            onSelectItem={setSelectedInventoryItem}
            onNewItem={() => {
              setIsNewItemOpen(true);
            }}
            onEditItem={() => {
              if (selectedInventoryItem) setIsEditItemOpen(true);
            }}
          />
        )}
        {activeTab === 'loans' && (
          <LoansSection
            loans={paginatedLoans}
            searchTerm={loansSearchTerm}
            filter={loansFilter}
            currentPage={loansPage}
            totalPages={loansTotalPages}
            onSearchChange={handleLoansSearch}
            onFilterChange={handleLoansFilterChange}
            onPageChange={handleLoansPageChange}
            onNewLoan={() => {
              setIsNewLoanOpen(true);
            }}
            onReturnLoan={handleOpenReturnLoan}
          />
        )}
      </div>

      {/* ── Modales de inventario ── */}
      <NewItemModal
        isOpen={isNewItemOpen}
        onClose={() => {
          setIsNewItemOpen(false);
        }}
        onSuccess={refetchInventory}
      />

      <EditItemModal
        isOpen={isEditItemOpen}
        item={selectedInventoryItem}
        onClose={() => {
          setIsEditItemOpen(false);
        }}
        onSuccess={() => {
          refetchInventory();
          setSelectedInventoryItem(null);
        }}
      />

      {/* ── Modales de préstamos ── */}
      <NewLoanModal
        isOpen={isNewLoanOpen}
        inventory={inventory}
        onClose={() => {
          setIsNewLoanOpen(false);
        }}
        onSuccess={() => {
          refetchLoans();
          refetchActiveLoans();
        }}
      />

      <ReturnLoanModal
        isOpen={isReturnLoanOpen}
        activeLoans={activeLoansPaginated}
        activeLoansTotal={activeLoansTotal}
        activeLoansPage={activeLoansPage}
        activeLoansTotalPages={activeLoansTotalPages}
        activeLoansLoading={activeLoansLoading}
        onActiveLoansPageChange={handleActiveLoansPageChange}
        onClose={() => {
          setIsReturnLoanOpen(false);
        }}
        onSuccess={() => {
          refetchLoans();
          refetchActiveLoans();
        }}
      />
    </div>
  );
};
