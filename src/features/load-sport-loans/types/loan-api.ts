import type { Loan } from '@/entities/loan/model';

export interface SportLoanBand {
  statusCode: number;
  data: {
    items: Loan[];
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
  items: SportLoanBand['data']['items'];
  currentPage: number;
  pageSize: number;
  total: number;
  totalPages: number;
  previous: boolean;
  next: boolean;
}
