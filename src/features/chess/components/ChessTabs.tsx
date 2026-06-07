interface TabsProps {
  activeTab: 'inventory' | 'loans';
  onTabChange: (tab: 'inventory' | 'loans') => void;
}

export const ChessTabs = ({ activeTab, onTabChange }: TabsProps) => (
  <div className="sport-tabs">
    <button
      className={`tab-button ${activeTab === 'inventory' ? 'active' : ''}`}
      onClick={() => {
        onTabChange('inventory');
      }}
    >
      <span className="tab-icon">📦</span>
      Inventario
    </button>
    <button
      className={`tab-button ${activeTab === 'loans' ? 'active' : ''}`}
      onClick={() => {
        onTabChange('loans');
      }}
    >
      <span className="tab-icon">📋</span>
      Préstamos
    </button>
  </div>
);
