import { fetchApi } from '@/shared/api/apiClient';
import type {
  CreateSportItemPayload,
  CreateSportItemResponse,
  InventoryTypeResponse,
  InventoryTypeData,
} from '../types';

export const getInventoryTypeByName = async (name: string): Promise<InventoryTypeData> => {
  const res = await fetchApi<InventoryTypeResponse>(`/inventory/types/${name}`);
  return res.data;
};

export const createSportItem = async (
  payload: CreateSportItemPayload,
): Promise<CreateSportItemResponse> => {
  return fetchApi<CreateSportItemResponse>('/sports', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};
