import { fetchApi } from '@/shared/api/apiClient';
import type { CreateChessBorrowRequest } from '@/features/chess/model/types';

export const createChessBorrow = (data: CreateChessBorrowRequest) =>
  fetchApi<{
    statusCode: number;
    data: { prestamo_id: number } | null;
    message: string;
  }>('/chess/borrow', {
    method: 'POST',
    body: JSON.stringify(data),
  }).then((res) => res.data);
