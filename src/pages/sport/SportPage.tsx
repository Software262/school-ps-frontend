import { useState } from 'react';
import { SportStats, SportTabs, useSportStats } from '@/features/sport';
import { SportInventorySection } from '@/features/load-sport-inventory/components';
import { useLoadSportInventory } from '@/features/load-sport-inventory/hooks';
import { SportLoansSection } from '@/features/load-sport-loans/components';
import { useLoadSportLoans, useSportLoansFilters } from '@/features/load-sport-loans/hooks';
import { NewSportLoanModal } from '@/features/new-sport-loan/components';
import type { Inventory } from '@/entities/inventory/model/types';
import { NewSportItemModal } from '@/features/new-sport-item';
import { EditSportItemModal } from '@/features/edit-sport-item';
import { editSportItem } from '@/features/edit-sport-item/api/edit-sport-item';
import { MaintenanceModal } from '@/shared/ui/organisms/MaintenanceModal';
import { ReturnLoanModal } from '@/features/return-sport-loan';
import { useActiveLoans } from '@/features/return-sport-loan/hooks';
import './SportPage.css';

export const SportPage = () => {
  // ── Inventario ──────────────────────────────────────────────────────────
  const {
    inventory,
    refetch: refetchInventory,
    page: inventoryPage,
    totalPages: inventoryTotalPages,
    searchTerm,
    handlePageChange: handleInventoryPageChange,
    handleSearch,
  } = useLoadSportInventory();

  // ── Préstamos ────────────────────────────────────────────────────────────
  const {
    loans,
    refetch: refetchLoans,
    page: loansCurrentPage,
    totalPages: loansTotalPages,
    filter: loansFilter,
    searchTerm: loansSearchTerm,
    handlePageChange: handleLoansPageChange,
    handleFilterChange: handleLoansFilterChange,
    handleSearch: handleLoansSearch,
  } = useLoadSportLoans();
  const { formattedLoans: paginatedLoans } = useSportLoansFilters(loans);

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

  // ── Estado de UI ─────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<'inventory' | 'loans'>('inventory');

  // Inventario
  const [selectedInventoryItem, setSelectedInventoryItem] = useState<Inventory | null>(null);
  const [isNewItemOpen, setIsNewItemOpen] = useState(false);
  const [isEditItemOpen, setIsEditItemOpen] = useState(false);
  // Préstamos
  const [isMaintenanceOpen, setIsMaintenanceOpen] = useState(false);
  const [isNewLoanOpen, setIsNewLoanOpen] = useState(false);
  const [isReturnLoanOpen, setIsReturnLoanOpen] = useState(false);
  // ── Derivados ────────────────────────────────────────────────────────────
  const { stats, refetch: refetchStats } = useSportStats();

  const handleOpenReturnLoan = () => {
    resetActiveLoans();
    setIsReturnLoanOpen(true);
  };

  return (
    <div className="sport-page">
      <header className="sport-header">
        <h1>Módulo de Deportes</h1>
        <p>Gestión de equipos deportivos</p>
      </header>

      <SportStats stats={stats} />
      <SportTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="sport-content">
        {activeTab === 'inventory' && (
          <SportInventorySection
            inventory={inventory}
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
              setIsEditItemOpen(true);
            }}
            onMaintenance={() => {
              setIsMaintenanceOpen(true);
            }}
          />
        )}
        {activeTab === 'loans' && (
          <SportLoansSection
            loans={paginatedLoans}
            searchTerm={loansSearchTerm}
            filter={loansFilter}
            currentPage={loansCurrentPage}
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

      {/* ── Modal de mantenimiento ── */}
      <MaintenanceModal
        isOpen={isMaintenanceOpen}
        inventory={inventory}
        itemLabel="Equipo"
        patchFn={editSportItem}
        onClose={() => {
          setIsMaintenanceOpen(false);
        }}
        onSuccess={() => {
          refetchInventory();
          refetchStats();
        }}
      />

      {/* ── Modales de préstamos ── */}
      <NewSportLoanModal
        isOpen={isNewLoanOpen}
        inventory={inventory}
        onClose={() => {
          setIsNewLoanOpen(false);
        }}
        onSuccess={() => {
          refetchLoans();
          refetchStats();
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
          refetchStats();
        }}
      />

      {/* ── Modales de inventario ── */}
      <NewSportItemModal
        isOpen={isNewItemOpen}
        onClose={() => {
          setIsNewItemOpen(false);
        }}
        onSuccess={() => {
          refetchInventory();
          refetchStats();
        }}
      />
      <EditSportItemModal
        isOpen={isEditItemOpen}
        onClose={() => {
          setIsEditItemOpen(false);
        }}
        onSuccess={() => {
          refetchInventory();
          refetchStats();
        }}
        item={selectedInventoryItem}
      />
    </div>
  );
};
