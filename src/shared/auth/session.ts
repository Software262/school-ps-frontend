// single source of truth for reading/writing the auth session in localStorage.
const AUTH_USER_KEY = 'auth_user';
const AUTH_TOKEN_KEY = 'auth_token';

export interface SessionUser {
  id: number;
  username: string;
  rol: 'Administración' | 'Rectoría' | 'Tesorería' | 'Docente';
  estado: boolean;
}

export function getSessionUser(): SessionUser | null {
  const userStr = localStorage.getItem(AUTH_USER_KEY);
  if (!userStr) return null;
  try {
    return JSON.parse(userStr) as SessionUser;
  } catch (err) {
    console.error('Error parsing user session:', err);
    return null;
  }
}

export function getSessionToken(): string | null {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setSession(user: SessionUser, token: string): void {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

export function clearSession(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
}
