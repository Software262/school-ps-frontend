import './Sidebar.css';

interface NavItem {
  id: string;
  label: string;
  icon: string;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: '⊙' },
  { id: 'paz-salvo', label: 'Paz y Salvo Central', icon: '🛡' },
  { id: 'matricula', label: 'Matrícula', icon: '📋' },
  { id: 'pension', label: 'Pensión', icon: '💰' },
  { id: 'escuelas', label: 'Escuelas de Formación', icon: '🎓' },
  { id: 'tesoreria', label: 'Salón Tesorería', icon: '📁' },
  { id: 'pruebas', label: 'Pruebas Internas', icon: '📝' },
  { id: 'deportes', label: 'Deportes', icon: '⚽' },
  { id: 'ajedrez', label: 'Ajedrez', icon: '♟' },
  { id: 'cafeteria', label: 'Cafetería', icon: '☕' },
  { id: 'titular', label: 'Salón Titular', icon: '🏫' },
  { id: 'banda', label: 'Banda', icon: '🎵' },
  { id: 'rectoria', label: 'Rectoría', icon: '🏛' },
];

interface SidebarProps {
  activeItem?: string;
  onNavigate?: (id: string) => void;
}

export const Sidebar = ({ activeItem = 'rectoria', onNavigate }: SidebarProps) => {
  return (
    <aside className="sidebar" role="navigation" aria-label="Navegación principal">
      {/* Brand */}
      <div className="sidebar-brand">
        <span className="sidebar-brand-name">SchoolPS</span>
        <span className="sidebar-brand-sub">Sistema de Paz y Salvo</span>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`sidebar-item${activeItem === item.id ? ' sidebar-item--active' : ''}`}
            onClick={() => onNavigate?.(item.id)}
            aria-current={activeItem === item.id ? 'page' : undefined}
          >
            <span className="sidebar-item-icon" aria-hidden="true">
              {item.icon}
            </span>
            <span className="sidebar-item-label">{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};
