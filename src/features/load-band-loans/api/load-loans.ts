import { fetchApi } from '@/shared/api/apiClient';
import type { LoanBand } from '../types/loan-api';

export const loadLoans = async (page = 1, limit = 10) => {
  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  const res = await fetchApi<LoanBand>(`/musical-band/borrowings?${query.toString()}`);

  if (res.statusCode !== 200) {
    return [];
  }

  console.log(res.data.items);
  return res.data.items;
};
