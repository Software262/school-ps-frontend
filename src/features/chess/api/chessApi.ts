import { fetchApi } from '@shared/api/apiClient';
import type {
  ChessInventory,
  ChessLoan,
  CreateChessBorrowRequest,
  ReturnChessRequest,
  ReturnChessResponse,
  PaginatedResponse,
} from '@/features/chess/model/types';

export const getChessType = () =>
  fetchApi<{ id: number; nombre: string }>('/inventory/types/ajedrez');

export const getChessInventory = (typeId: number, page = 1, limit = 50) =>
  fetchApi<PaginatedResponse<ChessInventory>>(
    `/inventory/items?type_id=${String(typeId)}&page=${String(page)}&limit=${String(limit)}`,
  );

export const getChessBorrowings = (typeId: number, page = 1, limit = 50) =>
  fetchApi<PaginatedResponse<ChessLoan>>(
    `/inventory/borrow?type_id=${String(typeId)}&page=${String(page)}&limit=${String(limit)}`,
  );

export const createChessBorrow = (data: CreateChessBorrowRequest) =>
  fetchApi<{ id: number }>('/inventory/borrow', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const returnChessBorrow = (borrowId: number, data: ReturnChessRequest) =>
  fetchApi<ReturnChessResponse>(`/chess/borrow/${String(borrowId)}/return`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
