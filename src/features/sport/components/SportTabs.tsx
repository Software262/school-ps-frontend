import { ModuleTabs } from '@/shared/ui/organisms/ModuleTabs';

interface SportTabsProps {
  activeTab: 'inventory' | 'loans';
  onTabChange: (tab: 'inventory' | 'loans') => void;
}

export const SportTabs = ({ activeTab, onTabChange }: SportTabsProps) => (
  <ModuleTabs
    activeTab={activeTab}
    onTabChange={onTabChange}
    inventoryIcon="⚽"
    className="sport-tabs"
  />
);
