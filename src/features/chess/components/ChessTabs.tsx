import { ModuleTabs } from '@/shared/ui/organisms/ModuleTabs';

interface ChessTabsProps {
  activeTab: 'inventory' | 'loans';
  onTabChange: (tab: 'inventory' | 'loans') => void;
}

export const ChessTabs = ({ activeTab, onTabChange }: ChessTabsProps) => (
  <ModuleTabs
    activeTab={activeTab}
    onTabChange={onTabChange}
    inventoryIcon="📦"
    className="sport-tabs"
  />
);
