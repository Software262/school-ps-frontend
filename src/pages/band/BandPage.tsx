import { useState, useMemo } from 'react';
import { BandAlert, BandStats, BandTabs, useBandStats } from '@/features/band';
import { InventorySection } from '@/features/load-band-inventory/components';
import { useLoadInventory, useInventoryFilters } from '@/features/load-band-inventory/hooks';
import { LoansSection } from '@/features/load-band-loans/components';
import { useLoadLoans, useLoansFilters } from '@/features/load-band-loans/hooks';
import { NewLoanModal } from '@/features/new-band-loan';
import { ReturnLoanModal } from '@/features/return-band-loan';
import { NewItemModal } from '@/features/new-band-item';
import { EditItemModal } from '@/features/edit-band-item';
import type { Inventory } from '@/entities/inventory/model/types';
import './BandPage.css';

export const BandPage = () => {
  // ── Inventario ──────────────────────────────────────────────────────────
  const { inventory, refetch: refetchInventory } = useLoadInventory();
  const {
    paginatedItems: paginatedInventory,
    currentPage,
    totalPages,
    searchTerm,
    handleSearch,
    handlePageChange,
  } = useInventoryFilters(inventory);

  // ── Préstamos ────────────────────────────────────────────────────────────
  const { loans, refetch: refetchLoans } = useLoadLoans();
  const {
    formattedLoans,
    paginatedItems: paginatedLoans,
    currentPage: loansCurrentPage,
    totalPages: loansTotalPages,
    searchTerm: loansSearchTerm,
    filter: loansFilter,
    handleSearch: handleLoansSearch,
    handleFilterChange: handleLoansFilterChange,
    handlePageChange: handleLoansPageChange,
  } = useLoansFilters(loans);

  // ── Estado de UI ─────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<'inventory' | 'loans'>('inventory');

  // Inventario
  const [selectedInventoryItem, setSelectedInventoryItem] = useState<Inventory | null>(null);
  const [isNewItemOpen, setIsNewItemOpen] = useState(false);
  const [isEditItemOpen, setIsEditItemOpen] = useState(false);

  // Préstamos
  const [isNewLoanOpen, setIsNewLoanOpen] = useState(false);
  const [isReturnLoanOpen, setIsReturnLoanOpen] = useState(false);

  // ── Derivados ────────────────────────────────────────────────────────────
  const stats = useBandStats(inventory);

  const activeLoans = useMemo(() => formattedLoans.filter((l) => l.enPrestamo), [formattedLoans]);

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
              if (selectedInventoryItem) setIsEditItemOpen(true);
            }}
          />
        )}
        {activeTab === 'loans' && (
          <LoansSection
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
              setIsReturnLoanOpen(true);
            }}
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
        onSuccess={refetchLoans}
      />

      <ReturnLoanModal
        isOpen={isReturnLoanOpen}
        activeLoans={activeLoans}
        onClose={() => {
          setIsReturnLoanOpen(false);
        }}
        onSuccess={refetchLoans}
      />
    </div>
  );
};
