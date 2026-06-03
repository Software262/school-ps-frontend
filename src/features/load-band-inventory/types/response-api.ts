import type { Inventory } from '@/entities/inventory/model/types';

export interface PaginationLoadBand {
  statusCode: number;
  data: {
    items: Inventory[];
    current_page: number;
    page_size: number;
  };
  message: string;
  details?: string | null;
}
