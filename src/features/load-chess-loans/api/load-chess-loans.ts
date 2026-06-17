import { fetchApi } from '@shared/api/apiClient';
import type { ChessLoan } from '@/features/chess/model/types';

export const getChessBorrowings = (page = 1, limit = 50) =>
  fetchApi<{
    statusCode: number;
    data: {
      items: ChessLoan[];
      current_page: number;
      page_size: number;
      total: number;
      total_pages: number;
      previous: boolean;
      next: boolean;
    };
    message: string;
    details: unknown;
  }>(`/chess/borrowings?page=${String(page)}&limit=${String(limit)}`).then((res) => res.data);
