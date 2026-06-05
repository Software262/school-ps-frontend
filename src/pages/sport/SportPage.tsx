import { useState } from 'react';
import { SportAlert, SportStats, SportTabs, useSportStats } from '@/features/sport';
import { SportInventorySection } from '@/features/load-sport-inventory/components';
import {
  useLoadSportInventory,
  useSportInventoryFilters,
} from '@/features/load-sport-inventory/hooks';
import { SportLoansSection } from '@/features/load-sport-loans/components';
import { useLoadSportLoans, useSportLoansFilters } from '@/features/load-sport-loans/hooks';
import { NewSportLoanModal } from '@/features/new-sport-loan/components';
import type { Inventory } from '@/entities/inventory/model/types';
import { NewSportItemModal } from '@/features/new-sport-item';
import { EditSportItemModal } from '@/features/edit-sport-item';
import './SportPage.css';

export const SportPage = () => {
  // ── Inventario ──────────────────────────────────────────────────────────
  const { inventory, refetch: refetchInventory } = useLoadSportInventory();
  const {
    paginatedItems: paginatedInventory,
    currentPage,
    totalPages,
    searchTerm,
    handleSearch,
    handlePageChange,
  } = useSportInventoryFilters(inventory);

  // ── Préstamos ────────────────────────────────────────────────────────────
  const { loans, refetch: refetchLoans } = useLoadSportLoans();
  const {
    paginatedItems: paginatedLoans,
    currentPage: loansCurrentPage,
    totalPages: loansTotalPages,
    searchTerm: loansSearchTerm,
    filter: loansFilter,
    handleSearch: handleLoansSearch,
    handleFilterChange: handleLoansFilterChange,
    handlePageChange: handleLoansPageChange,
  } = useSportLoansFilters(loans);

  // ── Estado de UI ─────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<'inventory' | 'loans'>('inventory');

  // Inventario
  const [selectedInventoryItem, setSelectedInventoryItem] = useState<Inventory | null>(null);
  const [isNewItemOpen, setIsNewItemOpen] = useState(false);
  const [isEditItemOpen, setIsEditItemOpen] = useState(false);
  // Préstamos
  const [isNewLoanOpen, setIsNewLoanOpen] = useState(false);
  // ── Derivados ────────────────────────────────────────────────────────────
  const stats = useSportStats(inventory);

  return (
    <div className="sport-page">
      <header className="sport-header">
        <h1>Módulo de Deportes</h1>
        <p>Gestión de equipos deportivos</p>
      </header>

      <SportAlert />
      <SportStats stats={stats} />
      <SportTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="sport-content">
        {activeTab === 'inventory' && (
          <SportInventorySection
            inventory={paginatedInventory}
            searchTerm={searchTerm}
            currentPage={currentPage}
            totalPages={totalPages}
            selectedItem={selectedInventoryItem}
            onSearchChange={handleSearch}
            onPageChange={handlePageChange}
            onSelectItem={setSelectedInventoryItem}
            onNewItem={() => {
              setIsNewItemOpen(true);
            }}
            onEditItem={() => {
              setIsEditItemOpen(true);
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
            onReturnLoan={() => {
              console.log('Funcionalidad pendiente');
            }}
          />
        )}
      </div>

      {/* ── Modales de préstamos ── */}
      <NewSportLoanModal
        isOpen={isNewLoanOpen}
        inventory={inventory}
        onClose={() => {
          setIsNewLoanOpen(false);
        }}
        onSuccess={refetchLoans}
      />

      {/* ── Modales de inventario ── */}
      <NewSportItemModal
        isOpen={isNewItemOpen}
        onClose={() => {
          setIsNewItemOpen(false);
        }}
        onSuccess={refetchInventory}
      />
      <EditSportItemModal
        isOpen={isEditItemOpen}
        onClose={() => {
          setIsEditItemOpen(false);
        }}
        onSuccess={refetchInventory}
        item={selectedInventoryItem}
      />
    </div>
  );
};
