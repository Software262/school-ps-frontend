import { fetchApi } from '@/shared/api/apiClient';
import type { SportLoanBand } from '../types/loan-api';

export const loadSportLoans = async (page = 1, limit = 10) => {
  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  const res = await fetchApi<SportLoanBand>(`/sports/borrow?${query.toString()}`);

  if (res.statusCode !== 200) {
    return [];
  }

  return res.data.items;
};