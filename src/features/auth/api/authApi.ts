import { fetchApi } from '@/shared/api/apiClient';
import type { SessionUser } from '@/shared/auth';

export interface LoginPayload {
  username: string;
  contrasenia: string;
}

export interface LoginResponse {
  mensaje: string;
  usuario: SessionUser;
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
