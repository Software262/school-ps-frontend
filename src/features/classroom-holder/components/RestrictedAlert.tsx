import { AlertTriangle } from 'lucide-react';

export const RestrictedAlert = () => {
  return (
    <div className="restricted-alert">
      <AlertTriangle className="restricted-alert-icon" size={20} aria-hidden="true" />
      <div>
        <h3 className="restricted-alert-title">Acceso Restringido</h3>
        <p className="restricted-alert-desc">
          Este módulo está disponible únicamente para docentes titulares y administradores.
        </p>
      </div>
    </div>
  );
};
