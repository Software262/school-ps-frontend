import { LoginForm } from '@/features/auth/ui/LoginForm';
import { useNavigate } from '@tanstack/react-router';
import { getSessionToken } from '@/shared/auth';
import { ShieldAlert } from 'lucide-react';
import './LoginPage.css';

export const LoginPage = () => {
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    const token = getSessionToken();
    if (token) {
      void navigate({ to: '/dashboard' });
    }
  }, [navigate]);

  const handleLoginSuccess = () => {
    // todos los roles aterrizan en el dashboard general
    void navigate({ to: '/dashboard' });
  };

  return (
    <div className="login-page">
      <div className="login-backdrop" aria-hidden="true">
        <img src="/background.gif" alt="" className="login-backdrop-gif" />
      </div>

      <div className="login-card">
        <div className="login-card-header">
          <img src="/escudo.png" alt="Escudo del Cambridge School" className="login-card-crest" />
          <div>
            <h1 className="login-card-title">SchoolPS</h1>
            <p className="login-card-subtitle">Sistema de Paz y Salvo Institucional</p>
          </div>
        </div>

        <hr className="login-card-divider" />

        <LoginForm onSuccess={handleLoginSuccess} />

        <div className="login-card-disclaimer">
          <ShieldAlert size={16} className="login-card-disclaimer-icon" />
          <span>Acceso restringido para personal autorizado del Cambridge School.</span>
        </div>
      </div>
    </div>
  );
};
