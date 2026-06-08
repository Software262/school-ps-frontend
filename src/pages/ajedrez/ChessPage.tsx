import { useState } from 'react';
import { ChessAlert, ChessStats, ChessTabs, useChessStats } from '@/features/chess';
import { useChessInventory } from '@/features/load-chess-inventory/hooks';
import { useChessLoans } from '@/features/load-chess-loans/hooks';
import { ChessInventorySection } from '@/features/load-chess-inventory/components';
import { ChessLoansSection } from '@/features/load-chess-loans/components';
import { NewChessLoanModal } from '@/features/new-chess-loan/components';
import { ReturnChessLoanModal } from '@/features/return-chess-loan/components';
import { ResolveChessLoanModal } from '@/features/resolve-chess-loan/components';
import type { ChessInventory, ChessLoan } from '@/features/chess/model/types';
import '@/pages/sport/SportPage.css';
import '@/pages/ajedrez/ChessPage.css';

export const ChessPage = () => {
  const { inventory, refetch: refetchInventory } = useChessInventory();
  const { loans, refetch: refetchLoans } = useChessLoans();

  const [activeTab, setActiveTab] = useState<'inventory' | 'loans'>('inventory');
  const [selectedItem, setSelectedItem] = useState<ChessInventory | null>(null);
  const [isNewLoanOpen, setIsNewLoanOpen] = useState(false);
  const [isReturnLoanOpen, setIsReturnLoanOpen] = useState(false);
  const [isResolveLoanOpen, setIsResolveLoanOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<ChessLoan | null>(null);

  const stats = useChessStats(inventory, loans);

  const handleReturnLoan = (loan: ChessLoan) => {
    setSelectedLoan(loan);
    setIsReturnLoanOpen(true);
  };

  const handleResolveLoan = (loan: ChessLoan) => {
    setSelectedLoan(loan);
    setIsResolveLoanOpen(true);
  };

  const handleReturnSuccess = () => {
    refetchLoans();
    refetchInventory();
  };

  const handleNewLoanSuccess = () => {
    refetchLoans();
    refetchInventory();
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
            onNewLoan={() => {
              setIsNewLoanOpen(true);
            }}
          />
        )}
        {activeTab === 'loans' && (
          <ChessLoansSection
            loans={loans}
            onReturnLoan={handleReturnLoan}
            onResolveLoan={handleResolveLoan}
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
      <ResolveChessLoanModal
        isOpen={isResolveLoanOpen}
        loan={selectedLoan}
        onClose={() => {
          setIsResolveLoanOpen(false);
          setSelectedLoan(null);
        }}
        onSuccess={handleReturnSuccess}
      />
    </div>
  );
};
