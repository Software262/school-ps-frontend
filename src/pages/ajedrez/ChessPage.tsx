import { useState } from 'react';
import { useChessInventory, useChessLoans, useChessStats } from '@/features/chess/hooks';
import {
  ChessAlert,
  ChessStats,
  ChessTabs,
  ChessInventorySection,
  ChessLoansSection,
  NewChessLoanModal,
  ReturnChessLoanModal,
} from '@/features/chess/components';
import type { ChessInventory, ChessLoan } from '@/features/chess/model/types';

export const ChessPage = () => {
  const { inventory, refetch: refetchInventory } = useChessInventory();
  const { loans, refetch: refetchLoans } = useChessLoans();

  const [activeTab, setActiveTab] = useState<'inventory' | 'loans'>('inventory');
  const [selectedItem, setSelectedItem] = useState<ChessInventory | null>(null);
  const [isNewLoanOpen, setIsNewLoanOpen] = useState(false);
  const [isReturnLoanOpen, setIsReturnLoanOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<ChessLoan | null>(null);

  const stats = useChessStats(inventory);

  const handleReturnLoan = (loan: ChessLoan) => {
    setSelectedLoan(loan);
    setIsReturnLoanOpen(true);
  };

  const handleReturnSuccess = () => {
    void refetchLoans();
    void refetchInventory();
  };

  const handleNewLoanSuccess = () => {
    void refetchLoans();
    void refetchInventory();
  };

  return (
    <div className="sport-page">
      <header className="sport-header">
        <h1>Módulo de Ajedrez</h1>
        <p>Gestión de tableros y material de ajedrez</p>
      </header>

      <ChessAlert />
      <ChessStats stats={stats} />
      <ChessTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="sport-content">
        {activeTab === 'inventory' && (
          <ChessInventorySection
            inventory={inventory}
            selectedItem={selectedItem}
            onSelectItem={setSelectedItem}
            onNewLoan={() => setIsNewLoanOpen(true)}
          />
        )}
        {activeTab === 'loans' && (
          <ChessLoansSection
            loans={loans}
            onReturnLoan={handleReturnLoan}
          />
        )}
      </div>

      <NewChessLoanModal
        isOpen={isNewLoanOpen}
        item={selectedItem}
        onClose={() => {
          setIsNewLoanOpen(false);
          setSelectedItem(null);
        }}
        onSuccess={handleNewLoanSuccess}
      />
      <ReturnChessLoanModal
        isOpen={isReturnLoanOpen}
        loan={selectedLoan}
        onClose={() => {
          setIsReturnLoanOpen(false);
          setSelectedLoan(null);
        }}
        onSuccess={handleReturnSuccess}
      />
    </div>
  );
};
