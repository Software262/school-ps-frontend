import { fetchApi } from '@shared/api/apiClient';
import type { ApiResponse } from '@shared/types/api';
import type {
  Complementario,
  CreateComplementarioRequest,
  CreateTipoComplementarioRequest,
  TipoComplementario,
  UpdateComplementarioRequest,
  UpdateTipoComplementarioRequest,
} from '../model/types';

const BASE = '/training-schools';

export async function getTiposComplementario(): Promise<TipoComplementario[]> {
  const res = await fetchApi<ApiResponse<TipoComplementario[]>>(`${BASE}/tipos-complementarios`);
  return Array.isArray(res.data) ? res.data : [];
}

export async function createTipoComplementario(
  payload: CreateTipoComplementarioRequest,
): Promise<TipoComplementario> {
  const res = await fetchApi<ApiResponse<TipoComplementario>>(`${BASE}/tipos-complementarios`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  if (!res.data) throw new Error(res.message || 'Error al crear el tipo de complementario');
  return res.data;
}

export async function updateTipoComplementario(
  id: number,
  payload: UpdateTipoComplementarioRequest,
): Promise<TipoComplementario> {
  const res = await fetchApi<ApiResponse<TipoComplementario>>(
    `${BASE}/tipos-complementarios/${String(id)}`,
    {
      method: 'PUT',
      body: JSON.stringify(payload),
    },
  );
  if (!res.data) throw new Error(res.message || 'Error al actualizar el tipo de complementario');
  return res.data;
}

export async function deleteTipoComplementario(id: number): Promise<void> {
  await fetchApi<ApiResponse<null>>(`${BASE}/tipos-complementarios/${String(id)}`, {
    method: 'DELETE',
  });
}

export async function getComplementarios(): Promise<Complementario[]> {
  const res = await fetchApi<ApiResponse<Complementario[]>>(`${BASE}/complementarios`);
  return Array.isArray(res.data) ? res.data : [];
}

export async function createComplementario(
  payload: CreateComplementarioRequest,
): Promise<Complementario> {
  const res = await fetchApi<ApiResponse<Complementario>>(`${BASE}/complementarios`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  if (!res.data) throw new Error(res.message || 'Error al crear el complementario');
  return res.data;
}

export async function updateComplementario(
  id: number,
  payload: UpdateComplementarioRequest,
): Promise<Complementario> {
  const res = await fetchApi<ApiResponse<Complementario>>(`${BASE}/complementarios/${String(id)}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  if (!res.data) throw new Error(res.message || 'Error al actualizar el complementario');
  return res.data;
}

export async function deleteComplementario(id: number): Promise<void> {
  await fetchApi<ApiResponse<null>>(`${BASE}/complementarios/${String(id)}`, {
    method: 'DELETE',
  });
}
