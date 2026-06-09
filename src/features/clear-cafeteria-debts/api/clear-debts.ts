import { fetchApi } from '@/shared/api/apiClient';
import type { ApiResponse } from '@shared/types/api';
import type { BulkRemoveBlockRequest } from '@/features/cafeteria/model/types';

export const clearCafeteriaDebts = async (data: BulkRemoveBlockRequest): Promise<void> => {
  await fetchApi<ApiResponse<number>>('/cafeteria/clear-debts', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};
