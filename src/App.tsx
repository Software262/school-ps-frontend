import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Sidebar } from './shared/ui/Sidebar';
import { TopBar } from './shared/ui/TopBar';
import RectoriaPage from './pages/RectoriaPage';
import './App.css';

/** Inner layout — needs to be inside BrowserRouter to use hooks */
const AppShell: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  /** Map sidebar item IDs to routes (only rectoria is implemented) */
  function handleNavigate(id: string) {
    if (id === 'rectoria') navigate('/rectoria');
    // Other modules: placeholder — could navigate to /coming-soon in future
  }

  /** Determine the active sidebar item from the current path */
  function getActiveItem(): string {
    if (location.pathname.startsWith('/rectoria')) return 'rectoria';
    return 'dashboard';
  }

  return (
    <div className="app-shell">
      {/* Sidebar */}
      <Sidebar activeItem={getActiveItem()} onNavigate={handleNavigate} />

      {/* Main area */}
      <div className="app-main">
        {/* Top notification bar */}
        <TopBar schoolName="Cambridge School" />

        {/* Page content */}
        <div className="app-content">
          <Routes>
            <Route path="/" element={<Navigate to="/rectoria" replace />} />
            <Route path="/rectoria" element={<RectoriaPage />} />
          </Routes>
        </div>
      </div>

      {/* Floating help button */}
      <button
        id="btn-help"
        aria-label="Ayuda"
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          width: 36,
          height: 36,
          borderRadius: '50%',
          background: '#555',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
          fontSize: 16,
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
          zIndex: 900,
        }}
        title="Ayuda"
      >
        ?
      </button>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}

export default App;
