import { fetchApi } from '@shared/api/apiClient';

export const getChessType = () =>
  fetchApi<{
    statusCode: number;
    data: { id: number; nombre: string };
    message: string;
    details: unknown;
  }>('/inventory/types/ajedrez').then((res) => res.data);
