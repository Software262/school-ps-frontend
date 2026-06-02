interface BandTabsProps {
  activeTab: 'inventory' | 'loans';
  onTabChange: (tab: 'inventory' | 'loans') => void;
}

export const BandTabs = ({ activeTab, onTabChange }: BandTabsProps) => {
  return (
    <div className="band-tabs">
      <button
        className={`tab-button ${activeTab === 'inventory' ? 'active' : ''}`}
        onClick={() => {
          onTabChange('inventory');
        }}
      >
        <span className="tab-icon">♪</span> Inventario
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
};
