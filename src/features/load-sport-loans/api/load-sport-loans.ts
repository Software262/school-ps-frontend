import { fetchApi } from '@/shared/api/apiClient';
import type { SportLoanBand, PaginationResult } from '../types/loan-api';

export const loadSportLoans = async (
  page = 1,
  limit = 10,
  active?: boolean,
): Promise<PaginationResult> => {
  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (active !== undefined) {
    query.append('active', String(active));
  }

  const res = await fetchApi<SportLoanBand>(`/sports/borrow?${query.toString()}`);

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
