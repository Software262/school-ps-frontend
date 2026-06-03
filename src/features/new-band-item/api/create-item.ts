import { fetchApi } from '@/shared/api/apiClient';
import type {
  CreateItemPayload,
  CreateItemResponse,
  InventoryTypeResponse,
  InventoryTypeData,
} from '../types';

export const getInventoryTypeByName = async (name: string): Promise<InventoryTypeData> => {
  const res = await fetchApi<InventoryTypeResponse>(`/inventory/types/${name}`);
  return res.data;
};

export const createItem = async (payload: CreateItemPayload): Promise<CreateItemResponse> => {
  return fetchApi<CreateItemResponse>('/musical-band', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};
