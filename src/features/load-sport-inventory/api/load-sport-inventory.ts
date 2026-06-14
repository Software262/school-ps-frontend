import { fetchApi } from '@shared/api/apiClient';
import type { PaginationLoadSport, PaginationResult } from '../types/response-api';

export const loadSportInventory = async (
  page = 1,
  limit = 10,
  search = '',
): Promise<PaginationResult> => {
  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  const term = search.trim();
  if (term) {
    query.append('q', term);
  }

  const res = await fetchApi<PaginationLoadSport>(`/sports/items?${query.toString()}`);

  if (res.statusCode !== 200) {
    return {
      items: [],
      currentPage: page,
      pageSize: limit,
      total: 0,
      totalPages: 0,
      next: false,
      previous: false,
    };
  }

  return {
    items: res.data.items,
    currentPage: res.data.current_page,
    pageSize: res.data.page_size,
    total: res.data.total,
    totalPages: res.data.total_pages,
    next: res.data.next,
    previous: res.data.previous,
  };
};
