import { fetchApi } from '@shared/api/apiClient';
import type { PaginationLoadBand } from '../types/response-api';

export const loadBand = async (page = 1, limit = 10) => {
  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  const res = await fetchApi<PaginationLoadBand>(`/musical-band/items?${query.toString()}`);

  if (res.statusCode !== 200) {
    return [];
  }

  return res.data.items;
};
