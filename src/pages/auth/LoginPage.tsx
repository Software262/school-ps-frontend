import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { LoginForm } from '@/features/auth/ui/LoginForm';
import { ShieldAlert } from 'lucide-react';

export const LoginPage = () => {
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      void navigate({ to: '/dashboard' });
    }
  }, [navigate]);

  const handleLoginSuccess = () => {
    // Navigate all roles to the dashboard
    void navigate({ to: '/dashboard' });
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background:
          'radial-gradient(circle at 10% 20%, rgba(128, 28, 28, 0.08) 0%, rgba(15, 23, 42, 0.03) 90%), #f8fafc',
        padding: '24px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative background shapes */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          left: '-10%',
          width: '400px',
          height: '400px',
          background:
            'radial-gradient(circle, rgba(128, 28, 28, 0.05) 0%, rgba(255, 255, 255, 0) 70%)',
          borderRadius: '50%',
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-10%',
          right: '-10%',
          width: '500px',
          height: '500px',
          background:
            'radial-gradient(circle, rgba(29, 78, 216, 0.03) 0%, rgba(255, 255, 255, 0) 70%)',
          borderRadius: '50%',
          zIndex: 0,
        }}
      />

      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(226, 232, 240, 0.8)',
          borderRadius: '16px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)',
          padding: '40px 32px',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}
      >
        {/* Branding Header */}
        <div
          style={{
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div
            style={{
              width: '54px',
              height: '54px',
              backgroundColor: '#801c1c',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '1.75rem',
              boxShadow: '0 10px 15px -3px rgba(128, 28, 28, 0.3)',
            }}
          >
            PS
          </div>
          <div>
            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                color: 'var(--text-main)',
                margin: '0 0 4px 0',
              }}
            >
              SchoolPS
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0 }}>
              Sistema de Paz y Salvo Institucional
            </p>
          </div>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: 0 }} />

        {/* Login Form component */}
        <LoginForm onSuccess={handleLoginSuccess} />

        {/* Support disclaimer */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
            background: '#f8fafc',
            borderRadius: '8px',
            padding: '10px 12px',
            border: '1px solid var(--border)',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
          }}
        >
          <ShieldAlert size={16} color="var(--text-muted)" style={{ flexShrink: 0 }} />
          <span>Acceso restringido para personal autorizado del Cambridge School.</span>
        </div>
      </div>
    </div>
  );
};
