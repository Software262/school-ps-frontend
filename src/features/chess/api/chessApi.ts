import { fetchApi } from '@shared/api/apiClient';
import type {
  ChessInventory,
  ChessLoan,
  CreateChessBorrowRequest,
  ReturnChessRequest,
  ReturnChessResponse,
  ResolveBorrowNoveltyRequest,
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

export const returnChessBorrow = (prestamoId: number, data: ReturnChessRequest) =>
  fetchApi<ApiWrapper<ReturnChessResponse>>(`/chess/return/${String(prestamoId)}`, {
    method: 'POST',
    body: JSON.stringify(data),
  }).then((res) => res.data);

export const resolveChessBorrowNovelty = (prestamoId: number, data: ResolveBorrowNoveltyRequest) =>
  fetchApi<ApiWrapper<{ id: number; mensaje: string }>>(
    `/chess/borrow/${String(prestamoId)}/resolve-novelty`,
    { method: 'POST', body: JSON.stringify(data) },
  ).then((res) => res.data);
