import { fetchApi } from '@/shared/api/apiClient';
import type { ApiResponse } from '@shared/types/api';
import type { DebtorRow, Grade } from '@/features/cafeteria/model/types';

export const loadDebtors = async (periodoId: number): Promise<DebtorRow[]> => {
  const res = await fetchApi<ApiResponse<DebtorRow[]>>(`/cafeteria/list/${String(periodoId)}`);
  return Array.isArray(res.data) ? res.data : [];
};

export const loadGrades = async (): Promise<Grade[]> => {
  const res = await fetchApi<ApiResponse<Grade[]>>('/cafeteria/grades');
  return Array.isArray(res.data) ? res.data : [];
};
