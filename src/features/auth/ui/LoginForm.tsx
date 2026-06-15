import { useState, type SubmitEvent } from 'react';
import { authApi } from '../api/authApi';
import { setSession } from '@/shared/auth';
import { Button } from '@/shared/ui/atoms/Button';
import { Input } from '@/shared/ui/atoms/Input';
import { AlertCircle, LogIn } from 'lucide-react';
import './LoginForm.css';

interface LoginFormProps {
  onSuccess: (rol: string) => void;
}

export const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const [username, setUsername] = useState('');
  const [contrasenia, setContrasenia] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!username.trim() || !contrasenia.trim()) {
      setError('Por favor complete todos los campos.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await authApi.login({ username, contrasenia });

      setSession(response.usuario, response.token);

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
      className="login-form"
      onSubmit={(e) => {
        void handleSubmit(e);
      }}
    >
      {error && (
        <div className="login-form-error" role="alert" aria-live="polite">
          <AlertCircle size={18} className="login-form-error-icon" />
          <span>{error}</span>
        </div>
      )}

      <Input
        label="Usuario"
        placeholder="Ingrese su nombre de usuario"
        required
        autoComplete="username"
        value={username}
        aria-invalid={error ? 'true' : undefined}
        onChange={(e) => {
          setUsername(e.target.value);
        }}
        disabled={loading}
      />

      <Input
        label="Contraseña"
        type="password"
        placeholder="Ingrese su contraseña"
        required
        autoComplete="current-password"
        value={contrasenia}
        aria-invalid={error ? 'true' : undefined}
        onChange={(e) => {
          setContrasenia(e.target.value);
        }}
        disabled={loading}
      />

      <Button
        type="submit"
        variant="primary"
        className="login-form-submit"
        disabled={loading}
        fullWidth
      >
        {loading ? (
          'Iniciando sesión...'
        ) : (
          <>
            <LogIn size={18} />
            Ingresar al Sistema
          </>
        )}
      </Button>
    </form>
  );
};
