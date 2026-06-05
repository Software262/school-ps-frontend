import { fetchApi } from '@/shared/api/apiClient';
import type { EditSportItemPayload, EditSportItemResponse } from '../types';

export const editSportItem = async (
  itemId: number,
  payload: EditSportItemPayload,
): Promise<EditSportItemResponse> => {
  return fetchApi<EditSportItemResponse>(`/sports/items/${String(itemId)}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
};
