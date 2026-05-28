import { createFileRoute, useNavigate, useLocation } from '@tanstack/react-router';
import { Sidebar } from '../../../../shared/ui/Sidebar';
import { TopBar } from '../../../../shared/ui/TopBar';
import RectoriaPage from '../../../../pages/RectoriaPage';
import React from 'react';

// Extract the layout logic from the old App.tsx
const RectoriaLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  function handleNavigate(id: string) {
    if (id === 'rectoria') navigate({ to: '/dashboard/rectoria' });
  }

  return (
    <div className="app-shell">
      <Sidebar activeItem="rectoria" onNavigate={handleNavigate} />
      <div className="app-main">
        <TopBar schoolName="Cambridge School" />
        <div className="app-content">
          <RectoriaPage />
        </div>
      </div>
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

export const Route = createFileRoute('/dashboard/rectoria/')({
  component: RectoriaLayout,
});
