import { fetchApi } from '@/shared/api/apiClient';
import type { ApiResponse } from '@shared/types/api';
import type { CafeteriaRecord, ManualBlockRequest } from '@/features/cafeteria/model/types';

export const createCafeteriaDebt = async (data: ManualBlockRequest): Promise<CafeteriaRecord> => {
  const res = await fetchApi<ApiResponse<CafeteriaRecord>>('/cafeteria/add-debt', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  if (!res.data) throw new Error(res.message || 'Error al registrar deuda');
  return res.data;
};
