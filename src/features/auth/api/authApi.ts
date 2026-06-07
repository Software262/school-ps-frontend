import { fetchApi } from '@/shared/api/apiClient';

export interface LoginPayload {
  username: string;
  contrasenia: string;
}

export interface LoginUser {
  id: number;
  username: string;
  rol: 'Administración' | 'Rectoría' | 'Tesorería' | 'Docente';
  estado: boolean;
}

export interface LoginResponse {
  mensaje: string;
  usuario: LoginUser;
  token: string;
}

export const authApi = {
  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    return fetchApi<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};
