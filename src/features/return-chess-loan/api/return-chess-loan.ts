import { fetchApi } from '@shared/api/apiClient';
import type { ReturnChessRequest, ReturnChessResponse } from '@/features/chess/model/types';

export const returnChessBorrow = (prestamoId: number, data: ReturnChessRequest) =>
  fetchApi<{
    statusCode: number;
    data: ReturnChessResponse;
    message: string;
    details: unknown;
  }>(`/chess/return/${String(prestamoId)}`, {
    method: 'POST',
    body: JSON.stringify(data),
  }).then((res) => res.data);
