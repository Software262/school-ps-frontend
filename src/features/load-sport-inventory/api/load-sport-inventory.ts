import { fetchApi } from '@shared/api/apiClient';
import type { PaginationLoadSport } from '../types/response-api';

export const loadSportInventory = async (page = 1, limit = 10) => {
  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    item_type: 'deporte',
  });

  const res = await fetchApi<PaginationLoadSport>(`/sports/items?${query.toString()}`);

  if (res.statusCode !== 200) {
    return [];
  }

  return res.data.items;
};