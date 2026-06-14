import type { Inventory } from '@/entities/inventory/model/types';

export interface PaginationLoadSport {
  statusCode: number;
  data: {
    items: Inventory[];
    current_page: number;
    page_size: number;
    total: number;
    total_pages: number;
    previous: boolean;
    next: boolean;
  };
  message: string;
  details?: string | null;
}

export interface PaginationResult {
  items: Inventory[];
  currentPage: number;
  pageSize: number;
  total: number;
  totalPages: number;
  previous: boolean;
  next: boolean;
}
