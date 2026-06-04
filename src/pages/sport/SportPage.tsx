import { useState } from 'react';
import { SportAlert, SportStats, SportTabs, useSportStats } from '@/features/sport';
import { SportInventorySection } from '@/features/load-sport-inventory/components';
import {
  useLoadSportInventory,
  useSportInventoryFilters,
} from '@/features/load-sport-inventory/hooks';
import { SportLoansSection } from '@/features/load-sport-loans/components';
import { useLoadSportLoans, useSportLoansFilters } from '@/features/load-sport-loans/hooks';
import type { Inventory } from '@/entities/inventory/model/types';
import { NewSportItemModal } from '@/features/new-sport-item';
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
  const { loans } = useLoadSportLoans();
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

  // Préstamos

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
              console.log('Funcionalidad pendiente');
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
              console.log('Funcionalidad pendiente');
            }}
            onReturnLoan={() => {
              console.log('Funcionalidad pendiente');
            }}
          />
        )}
      </div>
      {/* ── Modales de inventario ── */}
      <NewSportItemModal
        isOpen={isNewItemOpen}
        onClose={() => {
          setIsNewItemOpen(false);
        }}
        onSuccess={refetchInventory}
      />
    </div>
  );
};
