import { fetchApi } from '@/shared/api/apiClient';
import type { EditItemPayload, EditItemResponse } from '../types';

export const editItem = async (
  itemId: number,
  payload: EditItemPayload,
): Promise<EditItemResponse> => {
  return fetchApi<EditItemResponse>(`/musical-band/${String(itemId)}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
};
