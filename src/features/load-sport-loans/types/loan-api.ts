import type { Loan } from '@/entities/loan/model';

export interface SportLoanBand {
  statusCode: number;
  data: {
    items: Loan[];
    current_page: number;
    page_size: number;
  };
  message: string;
  details?: string | null;
}