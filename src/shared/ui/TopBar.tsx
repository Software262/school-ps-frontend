import React, { useState } from 'react';
import './TopBar.css';

interface TopBarProps {
  schoolName?: string;
}

export const TopBar: React.FC<TopBarProps> = ({
  schoolName = 'Cambridge School',
}) => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="topbar-notification" role="banner">
      <button
        className="topbar-close"
        onClick={() => { setVisible(false); }}
        aria-label="Cerrar notificación"
      >
        ✕
      </button>
      <span className="topbar-message">
        Bienvenido al Sistema de Paz y Salvo - {schoolName}
      </span>
    </div>
  );
};
