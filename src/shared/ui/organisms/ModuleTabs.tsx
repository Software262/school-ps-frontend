interface ModuleTabsProps {
  activeTab: 'inventory' | 'loans';
  onTabChange: (tab: 'inventory' | 'loans') => void;
  inventoryIcon: string;
  className?: string;
}

export const ModuleTabs = ({
  activeTab,
  onTabChange,
  inventoryIcon,
  className = 'band-tabs',
}: ModuleTabsProps) => (
  <div className={className}>
    <button
      className={`tab-button ${activeTab === 'inventory' ? 'active' : ''}`}
      onClick={() => {
        onTabChange('inventory');
      }}
    >
      <span className="tab-icon">{inventoryIcon}</span> Inventario
    </button>
    <button
      className={`tab-button ${activeTab === 'loans' ? 'active' : ''}`}
      onClick={() => {
        onTabChange('loans');
      }}
    >
      <span className="tab-icon">📋</span> Préstamos
    </button>
  </div>
);
