import { fetchApi } from '@/shared/api/apiClient';
import type {
  CreateChessItemPayload,
  CreateChessItemResponse,
  InventoryTypeData,
  InventoryTypeResponse,
} from '../types';

export const getInventoryTypeByName = async (name: string): Promise<InventoryTypeData> => {
  const res = await fetchApi<InventoryTypeResponse>(`/inventory/types/${name}`);
  return res.data;
};

export const createChessItem = async (
  payload: CreateChessItemPayload,
): Promise<CreateChessItemResponse> => {
  return fetchApi<CreateChessItemResponse>('/chess/items', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};
