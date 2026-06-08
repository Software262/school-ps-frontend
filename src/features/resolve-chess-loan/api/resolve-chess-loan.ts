import { fetchApi } from '@shared/api/apiClient';
import type { ResolveBorrowNoveltyRequest } from '@/features/chess/model/types';

export const resolveChessBorrowNovelty = (prestamoId: number, data: ResolveBorrowNoveltyRequest) =>
  fetchApi<{
    statusCode: number;
    data: { id: number; mensaje: string };
    message: string;
    details: unknown;
  }>(`/chess/borrow/${String(prestamoId)}/resolve-novelty`, {
    method: 'POST',
    body: JSON.stringify(data),
  }).then((res) => res.data);
