import { ModuleTabs } from '@/shared/ui/organisms/ModuleTabs';

interface BandTabsProps {
  activeTab: 'inventory' | 'loans';
  onTabChange: (tab: 'inventory' | 'loans') => void;
}

export const BandTabs = ({ activeTab, onTabChange }: BandTabsProps) => (
  <ModuleTabs
    activeTab={activeTab}
    onTabChange={onTabChange}
    inventoryIcon="♪"
    className="band-tabs"
  />
);
