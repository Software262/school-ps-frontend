import { useState, type SubmitEvent } from 'react';
import { authApi } from '../api/authApi';
import { Button } from '@/shared/ui/atoms/Button';
import { Input } from '@/shared/ui/atoms/Input';
import { LogIn } from 'lucide-react';

interface LoginFormProps {
  onSuccess: (rol: string) => void;
}

export const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const [username, setUsername] = useState('');
  const [contrasenia, setContrasenia] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    if (!username.trim() || !contrasenia.trim()) {
      setError('Por favor complete todos los campos.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await authApi.login({ username, contrasenia });

      // Store token and user details in localStorage
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('auth_user', JSON.stringify(response.usuario));

      onSuccess(response.usuario.rol);
    } catch (err: unknown) {
      console.error('Error logging in:', err);
      const errMsg = err instanceof Error ? err.message : 'Error al iniciar sesión';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        void handleSubmit(e);
      }}
      style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
    >
      {error && (
        <div
          style={{
            background: 'var(--status-red-bg)',
            color: '#991b1b',
            border: '1px solid #fecaca',
            borderRadius: 'var(--radius-md)',
            padding: '12px',
            fontSize: '0.875rem',
            fontWeight: 500,
          }}
        >
          {error}
        </div>
      )}

      <Input
        label="Usuario *"
        placeholder="Ingrese su nombre de usuario"
        required
        value={username}
        onChange={(e) => {
          setUsername(e.target.value);
        }}
        disabled={loading}
      />

      <Input
        label="Contraseña *"
        type="password"
        placeholder="Ingrese su contraseña"
        required
        value={contrasenia}
        onChange={(e) => {
          setContrasenia(e.target.value);
        }}
        disabled={loading}
      />

      <Button
        type="submit"
        variant="primary"
        style={{ backgroundColor: '#801c1c', marginTop: '8px' }}
        disabled={loading}
        fullWidth
      >
        {loading ? (
          'Iniciando sesión...'
        ) : (
          <>
            <LogIn size={18} style={{ marginRight: '8px' }} />
            Ingresar al Sistema
          </>
        )}
      </Button>
    </form>
  );
};
