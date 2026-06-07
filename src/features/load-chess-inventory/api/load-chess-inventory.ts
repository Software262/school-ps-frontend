import { fetchApi } from '@shared/api/apiClient';
import type { ChessInventory } from '@/features/chess/model/types';

export const getChessInventory = (typeId: number, page = 1, limit = 50) =>
  fetchApi<{
    statusCode: number;
    data: {
      items: ChessInventory[];
      current_page: number;
      page_size: number;
      total: number;
      total_pages: number;
      previous: boolean;
      next: boolean;
    };
    message: string;
    details: unknown;
  }>(`/inventory/items?type_id=${String(typeId)}&page=${String(page)}&limit=${String(limit)}`).then(
    (res) => res.data,
  );
