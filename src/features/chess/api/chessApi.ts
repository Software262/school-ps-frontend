import { fetchApi } from '@shared/api/apiClient';
import type {
  ChessInventory,
  ChessLoan,
  CreateChessBorrowRequest,
  ReturnChessRequest,
  ReturnChessResponse,
} from '@/features/chess/model/types';

interface ApiWrapper<T> {
  statusCode: number;
  success: boolean;
  data: T;
  message: string;
  details: unknown;
}

interface PaginatedData<T> {
  items: T[];
  current_page: number;
  page_size: number;
  total: number;
  total_pages: number;
  previous: boolean;
  next: boolean;
}

export const getChessType = () =>
  fetchApi<ApiWrapper<{ id: number; nombre: string }>>('/inventory/types/ajedrez').then(
    (res) => res.data,
  );

export const getChessInventory = (typeId: number, page = 1, limit = 50) =>
  fetchApi<ApiWrapper<PaginatedData<ChessInventory>>>(
    `/inventory/items?type_id=${String(typeId)}&page=${String(page)}&limit=${String(limit)}`,
  ).then((res) => res.data);

export const getChessBorrowings = (typeId: number, page = 1, limit = 50) =>
  fetchApi<ApiWrapper<PaginatedData<ChessLoan>>>(
    `/inventory/borrow?type_id=${String(typeId)}&page=${String(page)}&limit=${String(limit)}`,
  ).then((res) => res.data);

export const createChessBorrow = (data: CreateChessBorrowRequest) =>
  fetchApi<ApiWrapper<{ id: number }>>('/inventory/borrow', {
    method: 'POST',
    body: JSON.stringify(data),
  }).then((res) => res.data);

export const returnChessBorrow = (borrowId: number, data: ReturnChessRequest) =>
  fetchApi<ApiWrapper<ReturnChessResponse>>(`/chess/borrow/${String(borrowId)}/return`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }).then((res) => res.data);

export const resolveChessReturn = (borrowId: number) =>
  fetchApi<ApiWrapper<{ id: number; mensaje: string }>>(
    `/chess/borrow/${String(borrowId)}/resolve`,
    { method: 'PATCH' },
  ).then((res) => res.data);
